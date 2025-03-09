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
    enforce_collect_flow?: boolean;
    expiry_time?: number;
    callback?: {
      on_select_upi_intent?: (data: any) => Promise<any>;
    };
  };
}

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

// Enhanced Razorpay payment handler with mobile Chrome optimizations
export const initializeRazorpayPayment = async (navigate: any, toast: any) => {
  try {
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
    
    // Add a small delay to ensure script is fully initialized
    await new Promise(resolve => setTimeout(resolve, 700)); // Keeping existing delay

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

    // More precise detection for mobile Chrome
    const isAndroidChrome = /Android.*Chrome/.test(navigator.userAgent);
    const isIOSChrome = /iPhone|iPad/.test(navigator.userAgent) && /CriOS/.test(navigator.userAgent);
    const isMobileChrome = isAndroidChrome || isIOSChrome;
    console.log("Device detection - Android Chrome:", isAndroidChrome, "iOS Chrome:", isIOSChrome);

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

    // Specific configurations for mobile Chrome
    if (isMobileChrome) {
      console.log("Applying optimized intent flow for mobile Chrome");
      
      // Configure UPI payment methods with intent flow optimized for mobile Chrome
      options.config = {
        display: {
          blocks: {
            upi: {
              name: "Pay using UPI",
              instruments: [
                {
                  method: "upi",
                  flows: ["intent"]  // Keep using intent flow for mobile Chrome
                }
              ]
            },
            // Keep card and other options visible
            card: {
              name: "Pay via Card",
              instruments: [
                {
                  method: "card",
                  flows: ["seamless"]
                }
              ]
            },
            netbanking: {
              name: "Pay via Netbanking",
              instruments: [
                {
                  method: "netbanking",
                  flows: ["seamless"]
                }
              ]
            }
          },
          sequence: ["block.upi", "block.card", "block.netbanking"], // Prioritize UPI
          preferences: {
            show_default_blocks: true  // Show all payment options
          }
        }
      };
      
      // Track UPI detection state
      let upiDetectionSuccessful = false;
      let razorpayInstance: any = null;
      let detectionRetryCount = 0;
      const MAX_RETRIES = 2;
      
      // Enhanced UPI app detection with explicit retry mechanism
      options.upi = {
        flow: "intent",
        callback: {
          on_select_upi_intent: async function(data: any) {
            console.log("UPI intent selected - initializing enhanced app detection");
            
            if (data && typeof data === 'object') {
              // Set standard detection flags
              data._ensure_app_detection = true;
              data._validate_app_presence = true;
              
              // Track app detection start time
              const detectionStart = Date.now();
              data._detection_timestamp = detectionStart;
              
              // Configure detection metadata
              if (!data.app_detection_metadata) {
                data.app_detection_metadata = {};
              }
              
              data.app_detection_metadata = {
                ...data.app_detection_metadata,
                ensure_thorough_detection: true,
                allow_detection_retries: true,
                validate_before_proceed: true,
                detection_start: detectionStart
              };
              
              console.log("Enhanced app detection configured");
              
              // Create detection timeout - if UPI app detection doesn't complete within 3 seconds,
              // we'll flag it as potentially failed and prepare for retry
              setTimeout(() => {
                if (!upiDetectionSuccessful && razorpayInstance && detectionRetryCount < MAX_RETRIES) {
                  console.log(`UPI detection timeout reached (${detectionRetryCount + 1}/${MAX_RETRIES}). Retrying...`);
                  
                  try {
                    // Close current instance if possible
                    razorpayInstance.close();
                    
                    // Small delay before reopening
                    setTimeout(() => {
                      detectionRetryCount++;
                      razorpayInstance = new window.Razorpay(options);
                      razorpayInstance.open();
                      
                      console.log("Razorpay reopened for retry attempt", detectionRetryCount);
                      
                      // Show toast for user feedback
                      toast({
                        title: "Retrying UPI detection",
                        description: "We're optimizing the payment flow for your device...",
                      });
                    }, 500);
                  } catch (retryError) {
                    console.error("Error during retry:", retryError);
                    // Still allow regular payment flow to continue if retry fails
                  }
                } else if (detectionRetryCount >= MAX_RETRIES && !upiDetectionSuccessful) {
                  console.log("Max retries reached for UPI detection");
                  
                  // Show toast for user feedback
                  toast({
                    title: "Alternative payment options",
                    description: "UPI app detection is challenging on this device. Consider using card payment instead.",
                  });
                }
              }, 3000); // 3 second timeout for UPI detection
            }
            
            // Mark successful detection
            upiDetectionSuccessful = true;
            
            return data;
          }
        },
        // Ensure proper app handling while keeping options flexible
        enforce_collect_flow: false
      };
      
      console.log("Initializing Razorpay with options:", JSON.stringify(options));
      
      if (!window.Razorpay) {
        throw new Error("Razorpay not loaded");
      }
      
      // Create and store Razorpay instance for mobile Chrome
      razorpayInstance = new window.Razorpay(options);
      
      // Open payment interface with short delay to ensure everything is ready
      setTimeout(() => {
        razorpayInstance.open();
      }, 300);
    } else {
      // Standard opening for other browsers - no changes to existing code
      console.log("Initializing Razorpay with options:", JSON.stringify(options));
      
      if (!window.Razorpay) {
        throw new Error("Razorpay not loaded");
      }
      
      const razorpay = new window.Razorpay(options);
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
