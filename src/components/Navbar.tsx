
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Container from "./ui/container";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { loadScript } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out py-4",
        {
          "bg-white/80 backdrop-blur-md shadow-sm": scrolled,
          "bg-transparent": !scrolled,
        }
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <span className="font-medium text-lg">DecisionDynamo</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#about"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </nav>
          <div>
            <Button
              variant="default"
              className="rounded-full px-6 shadow-sm hover:shadow-md transition-all"
              onClick={handlePurchase}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
