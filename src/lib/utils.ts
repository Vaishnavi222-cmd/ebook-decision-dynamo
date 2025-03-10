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

// Enhanced UPI app detection tracking
const UPI_APP_DETECTION = {
  // Track detection states
  attempted: false,
  intentSelected: false,
  complete: false,
  // Track detection attempts
  attempts: 0,
  maxAttempts: 3,
  // Timeouts and callbacks
  detectionTimeout: null as number | null,
  callbackTimeout: null as number | null,
  // List of detected UPI apps
  detectedApps: [] as string[]
};

// Chrome UPI intent handler progress tracking
let upiIntentInProgress = false;
let upiAppLaunchAttempted = false;

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

// Enhanced network speed detection with more granularity
const getNetworkInfo = (): { isSlowNetwork: boolean, connectionType: string, roundTripTime: number } => {
  let isSlowNetwork = false;
  let connectionType = 'unknown';
  let roundTripTime = 0;
  
  // Use network information API if available
  if (navigator.connection) {
    const connection = navigator.connection as any;
    
    if ('effectiveType' in connection) {
      connectionType = connection.effectiveType;
      isSlowNetwork = connectionType === '2g' || connectionType === 'slow-2g';
    }
    
    if ('rtt' in connection) {
      roundTripTime = connection.rtt;
      // If RTT is very high, consider it a slow network regardless of effectiveType
      if (roundTripTime > 500) {
        isSlowNetwork = true;
      }
    }
  } else {
    // Fallback for browsers that don't support Network Information API
    isSlowNetwork = false;
    connectionType = 'unknown';
    roundTripTime = 0;
  }
  
  return { isSlowNetwork, connectionType, roundTripTime };
};

// Advanced UPI app detection with built-in retry mechanism
const detectUpiApps = (razorpay: any): Promise<string[]> => {
  console.log("Starting advanced UPI app detection...");
  UPI_APP_DETECTION.attempted = true;
  UPI_APP_DETECTION.attempts += 1;
  
  // Get network conditions
  const { isSlowNetwork, roundTripTime } = getNetworkInfo();
  
  // Calculate appropriate timeout based on network and previous attempts
  const baseTimeout = isSlowNetwork ? 3000 : 2000;
  const attemptMultiplier = Math.min(UPI_APP_DETECTION.attempts, 3);
  const adjustedTimeout = baseTimeout + (attemptMultiplier * 500);
  
  return new Promise((resolve) => {
    // Clear any existing timeout
    if (UPI_APP_DETECTION.detectionTimeout !== null) {
      clearTimeout(UPI_APP_DETECTION.detectionTimeout);
      UPI_APP_DETECTION.detectionTimeout = null;
    }
    
    // Set default apps in case detection fails
    const defaultApps = ['gpay', 'phonepe', 'paytm'];
    
    // Set a maximum timeout for detection
    UPI_APP_DETECTION.detectionTimeout = window.setTimeout(() => {
      console.log(`UPI app detection timed out after ${adjustedTimeout}ms - proceeding anyway`);
      UPI_APP_DETECTION.complete = true;
      
      // If we have no detected apps yet, use default list
      if (UPI_APP_DETECTION.detectedApps.length === 0) {
        UPI_APP_DETECTION.detectedApps = defaultApps;
      }
      
      resolve(UPI_APP_DETECTION.detectedApps);
    }, adjustedTimeout) as unknown as number;
    
    // Force UPI app detection to start
    if (razorpay && typeof razorpay.get === 'function') {
      try {
        // First try to fetch UPI intent apps
        razorpay.get('payment.upi_intent.apps', (data: any) => {
          console.log("Available UPI intent apps:", data);
          
          if (data && Array.isArray(data) && data.length > 0) {
            UPI_APP_DETECTION.detectedApps = data;
            UPI_APP_DETECTION.complete = true;
            clearTimeout(UPI_APP_DETECTION.detectionTimeout as number);
            resolve(data);
          } else {
            // If no intent apps, try standard UPI apps
            razorpay.get('payment.upi.apps', (stdData: any) => {
              console.log("Available standard UPI apps:", stdData);
              
              if (stdData && Array.isArray(stdData) && stdData.length > 0) {
                UPI_APP_DETECTION.detectedApps = stdData;
              } else {
                // Fall back to default list
                UPI_APP_DETECTION.detectedApps = defaultApps;
              }
              
              UPI_APP_DETECTION.complete = true;
              clearTimeout(UPI_APP_DETECTION.detectionTimeout as number);
              resolve(UPI_APP_DETECTION.detectedApps);
            });
          }
        });
      } catch (err) {
        console.log("Error in UPI app detection:", err);
        // Set detection complete even if there's an error to avoid blocking
        UPI_APP_DETECTION.complete = true;
        UPI_APP_DETECTION.detectedApps = defaultApps;
        resolve(defaultApps);
      }
    } else {
      console.log("Razorpay object not ready for app detection");
      UPI_APP_DETECTION.complete = true;
      resolve(defaultApps);
    }
  });
};

// Chrome-optimized UPI intent handler with enhanced progress tracking
const handleChromeUpiIntent = async (data: any, razorpay: any): Promise<any> => {
  console.log("Chrome UPI intent handler started:", data);
  UPI_APP_DETECTION.intentSelected = true;
  upiIntentInProgress = true;
  
  try {
    // Ensure some UPI apps have been detected
    if (!UPI_APP_DETECTION.complete) {
      console.log("UPI app detection not complete - initializing detection");
      await detectUpiApps(razorpay);
    }
    
    // Get the selected app if available
    const selectedApp = data && data.app ? data.app : null;
    if (selectedApp) {
      console.log(`User selected UPI app: ${selectedApp}`);
      // Track that we've attempted to launch an app
      upiAppLaunchAttempted = true;
    }
    
    // Get network conditions
    const { isSlowNetwork } = getNetworkInfo();
    
    // Add a progressive delay based on network conditions
    // This critical delay gives Chrome time to handle the intent
    const initialDelayTime = isSlowNetwork ? 1200 : 800;
    console.log(`Adding initial delay of ${initialDelayTime}ms before proceeding with intent`);
    await new Promise(resolve => setTimeout(resolve, initialDelayTime));
    
    // Additional delay based on whether we're launching an app
    if (selectedApp && !upiAppLaunchAttempted) {
      const appLaunchDelay = isSlowNetwork ? 1000 : 600;
      console.log(`Adding app launch delay of ${appLaunchDelay}ms`);
      await new Promise(resolve => setTimeout(resolve, appLaunchDelay));
    }
    
    // Reset tracking variables with a delayed timeout
    // This is important to allow for subsequent payment attempts
    if (UPI_APP_DETECTION.callbackTimeout !== null) {
      clearTimeout(UPI_APP_DETECTION.callbackTimeout);
    }
    
    UPI_APP_DETECTION.callbackTimeout = window.setTimeout(() => {
      console.log("Resetting UPI detection state for future payments");
      UPI_APP_DETECTION.attempted = false;
      UPI_APP_DETECTION.intentSelected = false;
      UPI_APP_DETECTION.complete = false;
      UPI_APP_DETECTION.attempts = 0;
      upiIntentInProgress = false;
      upiAppLaunchAttempted = false;
    }, 10000) as unknown as number;
    
    console.log("Chrome UPI intent handler completed");
    return data;
  } catch (error) {
    console.error("Error in Chrome UPI intent handler:", error);
    // Even on error, return the original data to allow payment to continue
    return data;
  }
};

// Enhanced Razorpay payment handler with improved mobile Chrome UPI handling
export const initializeRazorpayPayment = async (navigate: any, toast: any) => {
  try {
    // Reset all UPI detection state at the start of payment
    UPI_APP_DETECTION.attempted = false;
    UPI_APP_DETECTION.intentSelected = false;
    UPI_APP_DETECTION.complete = false;
    UPI_APP_DETECTION.attempts = 0;
    UPI_APP_DETECTION.detectedApps = [];
    upiIntentInProgress = false;
    upiAppLaunchAttempted = false;
    
    if (UPI_APP_DETECTION.detectionTimeout !== null) {
      clearTimeout(UPI_APP_DETECTION.detectionTimeout);
      UPI_APP_DETECTION.detectionTimeout = null;
    }
    
    if (UPI_APP_DETECTION.callbackTimeout !== null) {
      clearTimeout(UPI_APP_DETECTION.callbackTimeout);
      UPI_APP_DETECTION.callbackTimeout = null;
    }
    
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

    // Apply mobile Chrome specific adjustments
    if (isMobileChrome) {
      console.log("Applying optimized mobile Chrome UPI handling");
      
      // For Chrome, prioritize intent flow but show all payment options
      options.config = {
        display: {
          blocks: {
            upi: {
              name: "Pay using UPI Apps",
              instruments: [
                {
                  method: "upi",
                  // Prioritize intent flow for Chrome since it doesn't properly support collect
                  flows: ["intent", "collect"]
                }
              ]
            }
          },
          // Show all payment options by default
          preferences: {
            show_default_blocks: true
          }
        }
      };
      
      // Explicitly set up UPI with intent flow for Chrome
      options.upi = {
        flow: "intent", // Accept that Chrome prefers intent flow
        callback: {
          // Use our enhanced Chrome-specific handler
          on_select_upi_intent: function(data: any) {
            // Store a reference to the razorpay instance for use in callback
            const razorpay = this;
            return handleChromeUpiIntent(data, razorpay);
          }
        }
      };
      
      // Start app detection early for Chrome
      setTimeout(() => {
        if (window.Razorpay && !UPI_APP_DETECTION.attempted) {
          console.log("Starting proactive UPI app detection for Chrome");
          detectUpiApps(window.Razorpay);
        }
      }, 500);
    }

    console.log("Initializing Razorpay with options:", JSON.stringify(options));
    
    if (!window.Razorpay) {
      throw new Error("Razorpay not loaded");
    }
    
    const razorpay = new window.Razorpay(options);

    // Apply different opening strategies based on browser
    if (isMobileChrome) {
      console.log("Using optimized open strategy for mobile Chrome");
      
      // Add comprehensive Chrome-specific event listeners
      razorpay.on("payment.app_select", function(data: any) {
        console.log("Payment app selected:", data);
      });
      
      razorpay.on("payment.method.selected", function(data: any) {
        console.log("Payment method selected:", data);
        
        // If UPI method selected, ensure app detection will happen
        if (data && (data.method === "upi" || data.wallet === "googlepay")) {
          console.log("UPI method selected in Chrome, preparing app detection");
          // Start app detection if not already attempted
          if (!UPI_APP_DETECTION.attempted) {
            detectUpiApps(razorpay);
          }
        }
      });
      
      // Add UPI-specific listeners for better debugging and flow control
      razorpay.on("payment.upi.intent.selected", function(data: any) {
        console.log("UPI intent selected:", data);
      });
      
      razorpay.on("payment.error", function(data: any) {
        console.log("Payment error event:", data);
      });
      
      // Delayed open for mobile Chrome with appropriate delay
      setTimeout(() => {
        razorpay.open();
      }, 400);
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
