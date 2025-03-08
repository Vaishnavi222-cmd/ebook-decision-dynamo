
import React, { useEffect, useRef } from "react";
import Container from "./ui/container";
import { Check } from "lucide-react";

const features = [
  "Proven decision-making techniques",
  "Strategies to overcome confusion and doubt",
  "Methods to avoid common decision-making mistakes",
  "How to think critically and act with clarity"
];

const BookDetails = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section id="features" className="py-20 bg-secondary/30" ref={sectionRef}>
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <div className="inline-block bg-primary/5 px-4 py-1 rounded-full text-sm font-medium text-primary mb-4">
            What's Inside
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Make Better Decisions, Faster
          </h2>
          <p className="text-lg text-muted-foreground">
            Decision Dynamo gives you the tools and frameworks to cut through complexity and make confident choices in any situation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 md:order-1 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300 ease-out">
            <h3 className="text-2xl font-bold">Why This eBook?</h3>
            <p className="text-lg text-muted-foreground">
              In a fast-paced world, making the right decisions at the right time can be the key to success. This eBook provides real-world, issue-based decision-making strategies to help you tackle everyday challenges with confidence. Whether it's career choices, relationships, or life decisions, you'll gain practical insights to navigate them effectively.
            </p>
            
            <div className="space-y-4 mt-8">
              <h4 className="font-medium text-lg">What You'll Learn:</h4>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="bg-primary/10 rounded-full p-1 mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-primary font-semibold">All this at an affordable price of just ₹199!</p>
            </div>
          </div>
          
          <div className="relative p-4 order-1 md:order-2 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-500 ease-out">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6">
              <div className="aspect-[3/4] relative">
                <img
                  src="https://images.unsplash.com/photo-1553484771-047a44eee27a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                  alt="Inside the Decision Dynamo eBook"
                  className="object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                  <div className="text-white text-lg font-medium">Preview the first chapter free</div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded-full w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BookDetails;
