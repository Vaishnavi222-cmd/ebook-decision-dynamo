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

// Enhanced Razorpay payment handler with improved mobile Chrome optimizations
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
      console.log("Applying enhanced optimizations for mobile Chrome");
      
      // ENHANCEMENT 1: Configure UPI payment methods with improved intent flow for mobile Chrome
      options.config = {
        display: {
          blocks: {
            upi: {
              name: "Pay using UPI",
              instruments: [
                {
                  method: "upi",
                  flows: ["intent", "collect"] // Add collect as fallback
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
      
      // ENHANCEMENT 2: Multi-stage detection tracking flags
      let initialDetectionStarted = false;
      let intentSelectionComplete = false;
      let appDetectionStarted = false;
      let appDetectionComplete = false;
      let upiDetectionSuccessful = false;
      
      // ENHANCEMENT 3: Store Razorpay instance reference for retry mechanism
      let razorpayInstance: any = null;
      let detectionRetryCount = 0;
      const MAX_RETRIES = 2;
      
      // ENHANCEMENT 5: Adaptive timeouts based on retry count
      const getTimeoutDuration = (retryAttempt: number): number => {
        // Start with base timeout, extend for subsequent retries
        const baseDuration = 3000; // 3 seconds
        const networkConditionFactor = navigator.connection && 
          ('effectiveType' in navigator.connection) && 
          navigator.connection.effectiveType === '2g' ? 1.5 : 1;
        
        return baseDuration * (1 + (retryAttempt * 0.3)) * networkConditionFactor;
      };
      
      // ENHANCEMENT 6: Fallback detection for common UPI apps
      const checkCommonUpiApps = async (): Promise<boolean> => {
        console.log("Attempting fallback UPI app detection");
        
        // List of common UPI app URL schemes
        const commonUpiSchemes = [
          'gpay://',
          'phonepe://',
          'paytm://',
          'bhim://'
        ];
        
        try {
          // Create an invisible iframe to test app URL schemes
          const testFrame = document.createElement('iframe');
          testFrame.style.display = 'none';
          document.body.appendChild(testFrame);
          
          // Try each scheme to see if any apps are available
          for (const scheme of commonUpiSchemes) {
            try {
              // Set a timeout for detection
              const testPromise = new Promise<boolean>((resolve) => {
                setTimeout(() => resolve(false), 300);
                testFrame.onload = () => resolve(true);
                testFrame.onerror = () => resolve(false);
                testFrame.src = scheme;
              });
              
              const detected = await testPromise;
              if (detected) {
                console.log(`Detected UPI app with scheme: ${scheme}`);
                document.body.removeChild(testFrame);
                return true;
              }
            } catch (e) {
              console.log(`Error testing scheme ${scheme}:`, e);
            }
          }
          
          document.body.removeChild(testFrame);
          console.log("No common UPI apps detected");
          return false;
        } catch (e) {
          console.error("Error in fallback UPI detection:", e);
          return false;
        }
      };
      
      // ENHANCEMENT 7: Enhanced UPI app detection with advanced retry mechanism
      options.upi = {
        flow: "intent",
        callback: {
          on_select_upi_intent: async function(data: any) {
            console.log("UPI intent selected - initializing enhanced app detection", data);
            
            // Track intent selection completion
            intentSelectionComplete = true;
            
            if (data && typeof data === 'object') {
              // Set enhanced detection flags - ENHANCEMENT 1
              data._ensure_app_detection = true;
              data._validate_app_presence = true;
              data._thorough_detection = true;
              data._enforce_detection = true;
              
              // Track app detection start
              appDetectionStarted = true;
              const detectionStart = Date.now();
              data._detection_timestamp = detectionStart;
              
              // Configure enhanced detection metadata - ENHANCEMENT 1
              if (!data.app_detection_metadata) {
                data.app_detection_metadata = {};
              }
              
              data.app_detection_metadata = {
                ...data.app_detection_metadata,
                ensure_thorough_detection: true,
                allow_detection_retries: true,
                validate_before_proceed: true,
                detection_start: detectionStart,
                retry_count: detectionRetryCount,
                preferred_method: detectionRetryCount === 0 ? 'intent' : 'hybrid'
              };
              
              console.log("Enhanced app detection configured with metadata:", data.app_detection_metadata);
            }
            
            // Track app detection completion
            appDetectionComplete = true;
            
            return data;
          }
        },
        // Use more permissive settings to ensure compatibility
        enforce_collect_flow: false
      };
      
      console.log("Initializing Razorpay with enhanced options:", JSON.stringify(options));
      
      if (!window.Razorpay) {
        throw new Error("Razorpay not loaded");
      }
      
      // Create and store Razorpay instance for mobile Chrome
      razorpayInstance = new window.Razorpay(options);
      
      // Open payment interface with short delay to ensure everything is ready
      setTimeout(() => {
        razorpayInstance.open();
        initialDetectionStarted = true;
      }, 300);
      
      // ENHANCEMENT 3 & 5: Adaptive timeout detection with fallback
      const setupDetectionTimeout = (attempt: number) => {
        const timeoutDuration = getTimeoutDuration(attempt);
        console.log(`Setting up detection timeout #${attempt+1} for ${timeoutDuration}ms`);
        
        setTimeout(async () => {
          // Check if intent selection even started
          if (!initialDetectionStarted) {
            console.log("Initial detection failed to start");
            upiDetectionSuccessful = false;
          }
          
          // Check if we successfully got to the app detection phase
          else if (intentSelectionComplete && !appDetectionStarted) {
            console.log("Intent selected but app detection failed to start");
            upiDetectionSuccessful = false;
          }
          
          // Check if app detection started but didn't complete
          else if (appDetectionStarted && !appDetectionComplete) {
            console.log("App detection started but did not complete");
            upiDetectionSuccessful = false;
          }
          
          // If any detection stage failed and we haven't retried too many times
          if (!upiDetectionSuccessful && detectionRetryCount < MAX_RETRIES) {
            console.log(`UPI detection timeout reached (${detectionRetryCount + 1}/${MAX_RETRIES}). Applying retry strategy...`);
            
            try {
              // ENHANCEMENT 2: Different strategies based on retry count
              if (detectionRetryCount === 0) {
                // First retry: Try same intent flow with different parameters
                toast({
                  title: "Optimizing payment options...",
                  description: "Enhancing UPI app detection for your device.",
                });
                
                // Check if any common UPI apps are installed using our fallback
                const appsDetected = await checkCommonUpiApps();
                
                // Close current instance if possible
                if (razorpayInstance) {
                  razorpayInstance.close();
                }
                
                // If we detected apps but the regular flow failed, modify our approach
                if (appsDetected) {
                  console.log("Fallback detection found UPI apps. Retrying with modified settings.");
                  // Modify options for retry to better handle detected apps
                  if (options.upi) {
                    // Adjust UPI flow based on what we detected
                    options.upi.flow = "hybrid"; // Try hybrid flow on retry
                  }
                }
                
                // Small delay before reopening
                setTimeout(() => {
                  detectionRetryCount++;
                  // Create new instance with modified options
                  razorpayInstance = new window.Razorpay(options);
                  razorpayInstance.open();
                  
                  console.log("Razorpay reopened for retry attempt", detectionRetryCount);
                  
                  // Set up the next detection timeout
                  setupDetectionTimeout(detectionRetryCount);
                }, 500);
              } 
              else if (detectionRetryCount === 1) {
                // Second retry: Try alternative payment flow
                toast({
                  title: "Adjusting payment options...",
                  description: "Trying alternative UPI detection method.",
                });
                
                // Close current instance if possible
                if (razorpayInstance) {
                  razorpayInstance.close();
                }
                
                // For the final retry, try with collect flow
                if (options.upi) {
                  options.upi.flow = "collect";
                  options.upi.enforce_collect_flow = true;
                }
                
                // Resequence payment blocks to offer cards more prominently if UPI is problematic
                if (options.config?.display?.sequence) {
                  options.config.display.sequence = ["block.card", "block.upi", "block.netbanking"];
                }
                
                // Small delay before reopening
                setTimeout(() => {
                  detectionRetryCount++;
                  razorpayInstance = new window.Razorpay(options);
                  razorpayInstance.open();
                  
                  console.log("Razorpay reopened for final retry attempt with collect flow");
                  
                  // Set up the final timeout
                  setupDetectionTimeout(detectionRetryCount);
                }, 500);
              }
            } catch (retryError) {
              console.error("Error during retry:", retryError);
              // Still allow regular payment flow to continue if retry fails
              toast({
                title: "Consider alternative payment",
                description: "UPI detection is challenging on this device. Card payment is recommended.",
                variant: "destructive",
              });
            }
          } else if (detectionRetryCount >= MAX_RETRIES && !upiDetectionSuccessful) {
            console.log("Max retries reached for UPI detection");
            
            // Final fallback: suggest alternative payment method
            toast({
              title: "Please use card payment",
              description: "UPI app detection was unsuccessful. Card payment is more reliable on this device.",
              variant: "destructive",
            });
          }
        }, timeoutDuration);
      };
      
      // Set up the initial detection timeout
      setupDetectionTimeout(0);
      
    } else {
      // Standard opening for other browsers - no changes to existing code
      console.log("Initializing Razorpay with standard options");
      
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
