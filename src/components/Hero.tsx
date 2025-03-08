
import React, { useEffect, useRef } from "react";
import Container from "./ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

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

    if (heroRef.current) {
      const children = heroRef.current.querySelectorAll(".animate-on-scroll");
      children.forEach((child) => {
        observer.observe(child);
      });
    }

    return () => {
      if (heroRef.current) {
        const children = heroRef.current.querySelectorAll(".animate-on-scroll");
        children.forEach((child) => {
          observer.unobserve(child);
        });
      }
    };
  }, []);

  return (
    <section className="pt-32 pb-20 overflow-hidden" ref={heroRef}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
              <div className="inline-block bg-primary/5 px-4 py-1 rounded-full text-sm font-medium text-primary mb-4">
                Master Decision Making
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tighter">
                Decision Dynamo
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mt-4 max-w-lg">
                Transform your decision-making process with proven frameworks and actionable insights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300 ease-out">
              <Button 
                size="lg" 
                className="rounded-full text-base px-8 py-6 shadow-md hover:shadow-lg transition-all"
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              >
                Get the eBook <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full text-base px-8 py-6"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center gap-4 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-600 ease-out">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-white"
                  >
                    <span className="text-xs font-medium">{i}★</span>
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-medium">4.9/5</span> from over 1,200 readers
              </div>
            </div>
          </div>

          <div className="relative animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 delay-300 ease-out">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/30 rounded-2xl transform rotate-3 scale-105 animate-subtle-pulse"></div>
            <div className="relative bg-white shadow-xl rounded-2xl p-6 animate-float">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                alt="Decision Dynamo eBook"
                className="w-full h-auto rounded-lg shadow-lg"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-lg">
                <div className="text-lg font-bold">$29.99</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
