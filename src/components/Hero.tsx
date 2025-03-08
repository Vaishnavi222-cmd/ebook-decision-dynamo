
import React from "react";
import Container from "./ui/container";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { loadScript } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Hero = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePurchase = async () => {
    try {
      // Show loading toast
      toast({
        title: "Initializing payment...",
        description: "Please wait while we prepare your order.",
      });

      // Ensure Razorpay script is loaded
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      // Create order in Razorpay via edge function
      const orderResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderResponse.json();

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
            // Verify payment with edge function
            const verifyResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`, {
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

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            const verificationData = await verifyResponse.json();

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
            toast({
              title: "Payment cancelled",
              description: "You cancelled the payment process. You can try again whenever you're ready.",
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        title: "Error",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="pt-20 pb-16 overflow-hidden">
      <Container>
        {/* Heading at the top */}
        <h2 className="text-2xl md:text-3xl font-semibold text-primary text-center mb-12">
          Download Our Comprehensive Guide
        </h2>
        
        {/* Content row with image left, text right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/lovable-uploads/2d5d4bda-b97c-4e64-a427-53e3ef0cf438.png"
              alt="The Art of Smart Decisions Book Cover"
              className="w-full max-w-md mx-auto rounded-lg shadow-xl"
              loading="lazy"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              The Art of Smart Decisions: A Practical Guide to Confident Choices
            </h1>
            
            <p className="text-lg text-muted-foreground">
              This eBook offers clear, practical strategies to improve decision-making in all aspects of life. 
              With insightful content and actionable advice, it helps you make confident, well-informed choices.
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="rounded-md text-base px-8 py-6 shadow-md hover:shadow-lg transition-all"
                onClick={handlePurchase}
              >
                BUY NOW <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="text-2xl font-bold">
                ₹199 <span className="text-sm font-normal text-muted-foreground">only</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
