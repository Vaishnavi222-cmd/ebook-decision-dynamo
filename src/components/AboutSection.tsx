
import React from "react";
import Container from "./ui/container";
import { BookOpen } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-primary/10 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-6">
            About This eBook
          </h2>
          
          <div className="prose prose-lg mx-auto text-center text-muted-foreground">
            <p>
              Every choice you make shapes your life—whether it's a small daily decision or a life-altering one. 
              This eBook is your guide to mastering the art of decision-making, helping you gain clarity, confidence, 
              and control over your choices. You'll discover practical strategies, psychological insights, and proven 
              frameworks to make better decisions in every aspect of life—career, relationships, finances, and personal growth.
            </p>
            
            <p className="mt-4">
              If you've ever struggled with doubt, overthinking, or fear of making the wrong choice, this book will 
              empower you to take charge of your future with conviction. Because in the end, your decisions define your destiny.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;
