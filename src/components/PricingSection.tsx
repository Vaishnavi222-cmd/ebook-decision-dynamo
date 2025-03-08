
import React, { useEffect, useRef, useState } from "react";
import Container from "./ui/container";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const PricingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedPayment, setSelectedPayment] = useState<"one-time" | "subscription">("one-time");
  const { toast } = useToast();

  const handlePurchase = () => {
    toast({
      title: "Purchase initiated",
      description: "This would connect to a payment processor in a real application.",
    });
  };

  useEffect(() => {
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
                  ₹180
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

              {/* Removed the satisfaction guarantee text */}
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
