
import React, { useEffect, useRef } from "react";
import Container from "./ui/container";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { loadScript } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PricingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Razorpay script when component mounts
    loadScript("https://checkout.razorpay.com/v1/checkout.js");

    // Set up animation observers
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const children = sectionRef.current.querySelectorAll(".animate-on-scroll");
      children.forEach((child) => {
        observer.observe(child);
      });
    }

    return () => {
      if (sectionRef.current) {
        const children = sectionRef.current.querySelectorAll(".animate-on-scroll");
        children.forEach((child) => {
          observer.unobserve(child);
        });
      }
    };
  }, []);

  const handlePurchase = async () => {
    try {
      // Show loading toast
      toast({
        title: "Initializing payment...",
        description: "Please wait while we prepare your order.",
      });

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
    <section id="pricing" className="py-20" ref={sectionRef}>
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <div className="inline-block bg-primary/5 px-4 py-1 rounded-full text-sm font-medium text-primary mb-4">
            Very Affordable
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Premium Knowledge at an Affordable Price
          </h2>
          <p className="text-lg text-muted-foreground">
            Get in-depth knowledge that transforms your decision-making without breaking the bank.
          </p>
        </div>

        <div className="max-w-3xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300 ease-out">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="flex justify-center gap-4 mb-8">
                <Button
                  variant="default"
                  className="rounded-full px-6 shadow-md"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  One-time purchase
                </Button>
              </div>

              <div className="flex items-end justify-center gap-2 mb-6">
                <span className="text-5xl font-bold">
                  ₹199
                </span>
                <span className="text-muted-foreground mb-1">
                  only
                </span>
              </div>

              <p className="text-muted-foreground mb-8">
                One-time payment for lifetime access to comprehensive knowledge and resources
              </p>

              <Button 
                size="lg" 
                className="w-full py-6 text-base rounded-full shadow-md hover:shadow-lg transition-all"
                onClick={handlePurchase}
              >
                Buy Now
              </Button>
            </div>

            <div className="border-t p-8">
              <h3 className="font-semibold text-lg mb-4">What's included in this affordable price:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Complete in-depth knowledge resource (PDF, ePub & Kindle formats)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>25+ practical worksheets and templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Comprehensive explanations with real-world examples</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Expert insights and proven strategies</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Lifetime access to all future updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PricingSection;
