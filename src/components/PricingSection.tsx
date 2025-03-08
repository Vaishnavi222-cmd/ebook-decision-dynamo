
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
            Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Invest in Better Decision-Making
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the option that works best for you and transform your decision-making process today.
          </p>
        </div>

        <div className="max-w-3xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300 ease-out">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="flex justify-center gap-4 mb-8">
                <Button
                  variant={selectedPayment === "one-time" ? "default" : "outline"}
                  className={cn("rounded-full px-6", 
                    selectedPayment === "one-time" ? "shadow-md" : "")}
                  onClick={() => setSelectedPayment("one-time")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  One-time purchase
                </Button>
                <Button
                  variant={selectedPayment === "subscription" ? "default" : "outline"}
                  className={cn("rounded-full px-6", 
                    selectedPayment === "subscription" ? "shadow-md" : "")}
                  onClick={() => setSelectedPayment("subscription")}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Monthly subscription
                </Button>
              </div>

              <div className="flex items-end justify-center gap-2 mb-6">
                <span className="text-5xl font-bold">
                  {selectedPayment === "one-time" ? "$29" : "$4"}
                </span>
                <span className="text-muted-foreground mb-1">
                  {selectedPayment === "one-time" ? ".99" : ".99/month"}
                </span>
              </div>

              {selectedPayment === "one-time" ? (
                <p className="text-muted-foreground mb-8">
                  One-time payment, lifetime access to current edition + 1 year of updates
                </p>
              ) : (
                <p className="text-muted-foreground mb-8">
                  Cancel anytime. Includes all future updates and expanded resources.
                </p>
              )}

              <Button 
                size="lg" 
                className="w-full py-6 text-base rounded-full shadow-md hover:shadow-lg transition-all"
                onClick={handlePurchase}
              >
                Buy Now
              </Button>

              <div className="mt-4 text-sm text-muted-foreground">
                60-day money-back guarantee. No questions asked.
              </div>
            </div>

            <div className="border-t p-8">
              <h3 className="font-semibold text-lg mb-4">What's included:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Full 200+ page eBook (PDF, ePub & Kindle formats)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>30+ decision-making templates and worksheets</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Video course with 10 in-depth lessons</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Access to exclusive case studies</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Decision framework quick-reference cards</span>
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
