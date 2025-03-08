
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Refund = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main className="py-20">
        <Container className="max-w-4xl">
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="group pl-0 text-foreground/70 hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-8">Refund & Cancellation Policy</h1>
          <div className="prose prose-slate max-w-none">
            <p className="mb-4">
              We want you to be completely satisfied with your purchase of "The Art of Smart Decisions" eBook. Please read our refund and cancellation policy carefully.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Digital Product</h2>
            <p className="mb-4">
              Please note that "The Art of Smart Decisions" is a digital product delivered electronically. Once the eBook has been delivered to your specified email address or downloaded, it is considered delivered.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Refund Eligibility</h2>
            <p className="mb-4">
              Given the nature of digital products, we generally do not offer refunds once the eBook has been downloaded. However, we understand that exceptional circumstances may arise.
            </p>
            <p className="mb-4">
              You may be eligible for a refund if:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>You have not downloaded or accessed the eBook yet</li>
              <li>There is a significant technical issue that prevents you from accessing the eBook</li>
              <li>The content of the eBook is substantially different from what was advertised</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. Refund Process</h2>
            <p className="mb-4">
              To request a refund, please contact our customer support team within 7 days of your purchase. Include your order number and the reason for your refund request.
            </p>
            <p className="mb-4">
              We will review your request and respond within 5 business days. If approved, refunds will be processed to the original payment method and may take 5-10 business days to appear on your account statement.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Cancellation</h2>
            <p className="mb-4">
              You may cancel your order before the eBook is delivered. Once the eBook has been delivered or downloaded, cancellation is not possible and our refund policy applies.
            </p>

            <p className="mb-4">
              For any questions or concerns regarding our Refund & Cancellation Policy, please contact our customer support team.
            </p>

            <p className="mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Refund;
