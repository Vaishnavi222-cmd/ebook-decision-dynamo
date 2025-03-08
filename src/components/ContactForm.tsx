
import React, { useState, useRef, useEffect } from "react";
import Container from "./ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FormState {
  name: string;
  email: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  message: "",
};

const ContactForm = () => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          { 
            name: formState.name, 
            email: formState.email, 
            message: formState.message
          }
        ]);

      if (error) {
        console.error("Error submitting form:", error);
        throw error;
      }

      toast({
        title: "Message sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      setFormState(initialState);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please try again later.",
        variant: "destructive",
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
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
    <section id="contact" className="py-20 bg-primary/5" ref={sectionRef}>
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <div className="inline-block bg-primary/10 px-4 py-1 rounded-full text-sm font-medium text-primary mb-4">
            Get In Touch
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Have Questions?
          </h2>
          <p className="text-lg text-muted-foreground">
            We're here to help. Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="max-w-2xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300 ease-out">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg p-3 transition-all focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-4">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg p-3 transition-all focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-4">
                <label htmlFor="message" className="block text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg p-3 min-h-32 transition-all focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg py-6 shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactForm;
