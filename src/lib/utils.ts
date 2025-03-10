
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Add type declaration for the Razorpay object
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Define a more comprehensive type for Razorpay options
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  image: string;
  handler: (response: any) => Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    [key: string]: string;
  };
  theme: {
    color: string;
    backdrop_color?: string;
  };
  modal: {
    backdropclose: boolean;
    escape: boolean;
    handleback: boolean;
    animation: boolean;
    ondismiss: () => void;
  };
  // Add missing properties for mobile Chrome optimizations
  config?: {
    display?: {
      blocks?: {
        [key: string]: {
          name: string;
          instruments: Array<{
            method: string;
            flows: string[];
          }>;
        };
      };
      sequence?: string[];
      preferences?: {
        show_default_blocks: boolean;
      };
    };
  };
  upi?: {
    flow: string;
    callback?: {
      on_select_upi_intent?: (data: any) => Promise<any>;
    };
  };
}

// Add tracking variables for UPI app detection status
let upiAppDetectionAttempted = false;
let upiIntentSelected = false;
let upiAppDetectionComplete = false;
let upiDetectionTimeout: number | null = null;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const loadScript = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      console.log("Script already loaded:", src);
      resolve(true);
      return;
    }
    
    console.log("Loading script:", src);
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      console.log("Script loaded successfully:", src);
      resolve(true);
    };
    script.onerror = (error) => {
      console.error("Error loading script:", src, error);
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Helper function to determine if network is slow
const isSlowNetwork = (): boolean => {
  if (navigator.connection && 'effectiveType' in navigator.connection) {
    const effectiveType = (navigator.connection as any).effectiveType;
    return effectiveType === '2g' || effectiveType === 'slow-2g';
  }
  return false;
};

// Enhanced UPI app detection helper
const ensureUpiAppDetection = (razorpay: any): Promise<void> => {
  console.log("Starting UPI app detection process...");
  upiAppDetectionAttempted = true;
  
  // Calculate appropriate timeout based on network conditions
  const baseTimeout = isSlowNetwork() ? 2500 : 1500;
  
  return new Promise((resolve) => {
    // Clear any existing timeout
    if (upiDetectionTimeout !== null) {
      clearTimeout(upiDetectionTimeout);
    }
    
    // Set up detection monitoring
    const checkInterval = setInterval(() => {
      if (upiAppDetectionComplete) {
        console.log("UPI app detection completed");
        clearInterval(checkInterval);
        resolve();
      }
    }, 200);
    
    // Set a maximum timeout for detection
    upiDetectionTimeout = window.setTimeout(() => {
      console.log("UPI app detection timed out - proceeding anyway");
      upiAppDetectionComplete = true;
      clearInterval(checkInterval);
      resolve();
    }, baseTimeout) as unknown as number;
    
    // Force UPI app detection to start
    if (razorpay && typeof razorpay.get === 'function') {
      try {
        // Try to get available UPI apps through Razorpay's API
        razorpay.get('payment.upi.apps', (data: any) => {
          console.log("Available UPI apps:", data);
          upiAppDetectionComplete = true;
        });
      } catch (err) {
        console.log("Error in UPI app detection:", err);
        // Set detection complete even if there's an error to avoid blocking
        upiAppDetectionComplete = true;
      }
    }
  });
};

// Implement UPI intent retry if detection fails
const handleUpiIntentWithRetry = async (data: any, razorpay: any): Promise<any> => {
  console.log("UPI intent selected:", data);
  upiIntentSelected = true;
  
  // Short delay before proceeding
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Ensure UPI app detection completes properly
  if (!upiAppDetectionComplete) {
    console.log("UPI app detection not yet complete - waiting");
    await ensureUpiAppDetection(razorpay);
  }
  
  // Add a delay before proceeding with the intent
  const delayTime = isSlowNetwork() ? 1200 : 800;
  await new Promise(resolve => setTimeout(resolve, delayTime));
  
  // Reset tracking variables for potential future payments
  setTimeout(() => {
    upiAppDetectionAttempted = false;
    upiIntentSelected = false;
    upiAppDetectionComplete = false;
  }, 5000);
  
  return data;
};

// Enhanced Razorpay payment handler with mobile Chrome optimizations
export const initializeRazorpayPayment = async (navigate: any, toast: any) => {
  try {
    // Reset tracking variables at the start of payment
    upiAppDetectionAttempted = false;
    upiIntentSelected = false;
    upiAppDetectionComplete = false;
    
    // Show loading toast
    toast({
      title: "Initializing payment...",
      description: "Please wait while we prepare your order.",
    });

    // Ensure Razorpay script is loaded
    console.log("Loading Razorpay script...");
    const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    
    if (!scriptLoaded) {
      throw new Error("Failed to load Razorpay checkout script");
    }
    
    // Add a small delay to ensure script is fully initialized (helps with mobile Chrome)
    await new Promise(resolve => setTimeout(resolve, 300));

    // Create an order
    console.log("Creating order...");
    const orderResponse = await fetch("https://qftiuthwtvksvflgnrqg.supabase.co/functions/v1/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmdGl1dGh3dHZrc3ZmbGducnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NTA1NjcsImV4cCI6MjA1NzAyNjU2N30.rgsYVafODpggXgg8S8_HsvRJBkVlCVxVwBi24Hn4XW4"
      }
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error("Order creation response:", orderResponse.status, errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      throw new Error(`Order creation failed: ${errorData.message || orderResponse.statusText}`);
    }

    const orderData = await orderResponse.json();
    console.log("Order created successfully:", orderData);

    // Detect if running on Chrome mobile
    const isMobileChrome = /Android.*Chrome/.test(navigator.userAgent) || 
                           (/iPhone|iPad/.test(navigator.userAgent) && /CriOS/.test(navigator.userAgent));
    console.log("Is mobile Chrome:", isMobileChrome);

    // Base configuration for Razorpay
    const options: RazorpayOptions = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "Decision Dynamo",
      description: "Premium eBook Purchase",
      order_id: orderData.id,
      image: "/lovable-uploads/2d5d4bda-b97c-4e64-a427-53e3ef0cf438.png",
      handler: async function(response: any) {
        console.log("Payment successful:", response);
        
        // Verify payment
        try {
          const verifyResponse = await fetch("https://qftiuthwtvksvflgnrqg.supabase.co/functions/v1/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmdGl1dGh3dHZrc3ZmbGducnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NTA1NjcsImV4cCI6MjA1NzAyNjU2N30.rgsYVafODpggXgg8S8_HsvRJBkVlCVxVwBi24Hn4XW4"
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          if (!verifyResponse.ok) {
            const errorData = await verifyResponse.json();
            throw new Error(`Payment verification failed: ${errorData.message || verifyResponse.statusText}`);
          }

          const verifyData = await verifyResponse.json();
          console.log("Payment verification successful:", verifyData);
          
          toast({
            title: "Purchase successful!",
            description: "Your payment was successful. Redirecting to download page...",
          });
          
          // Navigate to download page with token from verification
          setTimeout(() => {
            navigate(`/download?token=${verifyData.download_token}`);
          }, 1500);
        } catch (verifyError) {
          console.error("Verification error:", verifyError);
          toast({
            title: "Verification issue",
            description: "Payment was received but verification had an issue. Please contact support.",
            variant: "destructive",
          });
        }
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      notes: {
        product: "Decision Dynamo eBook"
      },
      theme: {
        color: "#4F46E5",
        backdrop_color: "rgba(0,0,0,0.75)" // Darker backdrop for better visibility on mobile
      },
      modal: {
        backdropclose: false, // Prevent accidental dismissal on mobile
        escape: false, // Disable escape key to close (mobile keyboard issues)
        handleback: true, // Handle back button properly on mobile
        animation: false, // Disable animations for better performance on mobile Chrome
        ondismiss: function() {
          console.log("Payment modal dismissed by user");
          toast({
            title: "Payment cancelled",
            description: "You cancelled the payment process. You can try again whenever you're ready.",
          });
        },
      },
    };

    // Apply mobile Chrome specific adjustments for UPI payments
    if (isMobileChrome) {
      console.log("Applying mobile Chrome specific UPI optimizations");
      
      // First - make sure we show all payment options normally
      options.config = {
        display: {
          blocks: {
            upi: {
              // Customize UPI display settings
              name: "Pay using UPI Apps",
              instruments: [
                {
                  method: "upi",
                  // Use hybrid approach to allow both collect and intent flows
                  // Start with collect to ensure proper app detection
                  flows: ["collect", "intent"]
                }
              ]
            }
          },
          // Don't set sequence here to allow all payment methods to show
          preferences: {
            show_default_blocks: true // Show all payment options
          }
        }
      };
      
      // Add explicit UPI event listeners and advanced retry mechanism
      options.upi = {
        // Use two-stage flow for UPI to allow proper app detection
        flow: "collect",
        callback: {
          // Implement our enhanced UPI intent handler with retry mechanism
          on_select_upi_intent: function(data: any) {
            // Store a reference to the razorpay instance for use in callback
            const razorpay = this;
            return handleUpiIntentWithRetry(data, razorpay);
          }
        }
      };
      
      // Extra time for mobile Chrome to prepare detection capabilities
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    console.log("Initializing Razorpay with options:", JSON.stringify(options));
    
    if (!window.Razorpay) {
      throw new Error("Razorpay not loaded");
    }
    
    const razorpay = new window.Razorpay(options);

    // Apply different opening strategies based on browser
    if (isMobileChrome) {
      console.log("Using optimized open strategy for mobile Chrome");
      
      // Add UPI-specific event listeners for better app detection
      razorpay.on("payment.app_select", function(data: any) {
        console.log("Payment app selected:", data);
      });
      
      razorpay.on("payment.method.selected", function(data: any) {
        console.log("Payment method selected:", data);
        
        // If UPI method selected, ensure app detection will happen
        if (data && (data.method === "upi" || data.wallet === "googlepay")) {
          console.log("UPI method selected, preparing app detection");
          // Start watching for app detection
          setTimeout(() => {
            if (!upiAppDetectionAttempted) {
              console.log("Forcing UPI app detection");
              ensureUpiAppDetection(razorpay);
            }
          }, 1000);
        }
      });
      
      // Delayed open for mobile Chrome
      setTimeout(() => {
        razorpay.open();
      }, 300);
    } else {
      // Standard opening for other browsers - unchanged
      razorpay.open();
    }
  } catch (error) {
    console.error("Purchase error:", error);
    toast({
      title: "Error",
      description: typeof error === "object" && error !== null && "message" in error 
        ? `Payment error: ${error.message}`
        : "There was an error processing your purchase. Please try again.",
      variant: "destructive",
    });
  }
};
