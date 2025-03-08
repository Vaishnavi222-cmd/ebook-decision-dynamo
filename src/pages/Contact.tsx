
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import Container from "@/components/ui/container";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
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
