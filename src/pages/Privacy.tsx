
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/ui/container";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main className="py-20">
        <Container className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-slate max-w-none">
            <p className="mb-4">
              Your privacy is important to us. This Privacy Policy explains how DecisionDynamo collects, uses, and safeguards your information when you purchase our eBook "The Art of Smart Decisions".
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
            <p className="mb-4">
              When you purchase our eBook, we collect personal information such as your name, email address, and payment details. We may also collect non-personal information such as browser type, operating system, and referring pages.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Process transactions and deliver the eBook</li>
              <li>Send you updates about our products and services</li>
              <li>Improve our website and customer service</li>
              <li>Respond to your inquiries and support requests</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Cookies</h2>
            <p className="mb-4">
              Our website may use cookies to enhance your experience. You can set your browser to refuse all or some browser cookies, but this may affect some functionality of the website.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Third-Party Disclosure</h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required to provide you with services, such as payment processing.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Your Rights</h2>
            <p className="mb-4">
              You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us.
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

export default Privacy;
