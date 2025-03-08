
import React from "react";
import Container from "./ui/container";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const Hero = () => {
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
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              >
                BUY NOW <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="text-2xl font-bold">
                ₹180
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
