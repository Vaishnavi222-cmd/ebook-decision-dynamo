
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Link to="/">
                <Button variant="ghost" className="group pl-0 text-foreground/70 hover:text-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-center">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground text-center mb-12">
              Have a question or feedback? We're here to help. Fill out the form below and we'll get back to you as soon as possible.
            </p>
            <ContactForm />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
