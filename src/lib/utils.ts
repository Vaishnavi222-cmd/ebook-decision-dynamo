
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

    // Get Supabase URL from environment
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      console.error("VITE_SUPABASE_URL is not defined in environment variables");
      throw new Error("Missing configuration: Supabase URL");
    }
    
    // Create order in Razorpay via edge function
    console.log("Creating Razorpay order...");
    console.log("Calling edge function at:", `${supabaseUrl}/functions/v1/create-order`);
    
    const orderResponse = await fetch(`${supabaseUrl}/functions/v1/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Order response status:", orderResponse.status);
    
    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error("Order creation failed:", orderResponse.status, errorText);
      throw new Error("Failed to create order");
    }

    const orderData = await orderResponse.json();
    console.log("Order created successfully:", orderData);

    // Initialize Razorpay checkout
    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Decision Dynamo",
      description: "Premium eBook Purchase",
      order_id: orderData.id,
      handler: async function (response: any) {
        try {
          console.log("Payment successful, verifying payment...");
          // Verify payment with edge function
          const verifyResponse = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          console.log("Verification response status:", verifyResponse.status);
          
          if (!verifyResponse.ok) {
            const errorText = await verifyResponse.text();
            console.error("Payment verification failed:", verifyResponse.status, errorText);
            throw new Error("Payment verification failed");
          }

          const verificationData = await verifyResponse.json();
          console.log("Payment verified successfully:", verificationData);

          toast({
            title: "Purchase successful!",
            description: "Your payment was successful. Redirecting to download page...",
          });

          // Navigate to download page with token
          setTimeout(() => {
            navigate(`/download?token=${verificationData.download_token}`);
          }, 1500);
        } catch (error) {
          console.error("Verification error:", error);
          toast({
            title: "Verification failed",
            description: "We couldn't verify your payment. Please contact support.",
            variant: "destructive",
          });
        }
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#4F46E5",
      },
      modal: {
        ondismiss: function() {
          console.log("Payment modal dismissed by user");
          toast({
            title: "Payment cancelled",
            description: "You cancelled the payment process. You can try again whenever you're ready.",
          });
        },
      },
    };

    console.log("Initializing Razorpay with options:", JSON.stringify(options));
    
    if (!window.Razorpay) {
      throw new Error("Razorpay not loaded");
    }
    
    const razorpay = new window.Razorpay(options);
    razorpay.open();
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
