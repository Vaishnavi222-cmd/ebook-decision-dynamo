
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Download, FileCheck, Timer, Mail } from "lucide-react";

const ShippingDelivery = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2 mb-4">
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping & Delivery</h1>
            <div className="h-1 w-20 bg-primary mb-6"></div>
          </div>

          <div className="space-y-8">
            <section className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <div className="flex items-start gap-4">
                <Download className="h-8 w-8 text-primary mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Digital Product: No Physical Shipping</h2>
                  <p className="text-gray-700">
                    DecisionDynamo is a digital ebook that requires no physical shipping. 
                    Once your purchase is complete, you'll receive immediate access to download 
                    your ebook directly to your device.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                <span>Instant Delivery Process</span>
              </h2>
              <div className="ml-7">
                <ol className="list-decimal space-y-3 text-gray-700">
                  <li><strong>Purchase Confirmation:</strong> After completing your purchase, you'll receive an immediate confirmation on the website.</li>
                  <li><strong>Email Delivery:</strong> Within minutes, a download link will be sent to the email address you provided during checkout.</li>
                  <li><strong>Direct Download:</strong> You can also download the ebook directly from your account dashboard after purchase.</li>
                  <li><strong>Accessible Formats:</strong> Your ebook will be delivered in PDF format, compatible with most devices and readers.</li>
                </ol>
              </div>
            </section>

            <section className="bg-green-50 p-6 rounded-lg border border-green-100">
              <div className="flex items-start gap-4">
                <Timer className="h-8 w-8 text-green-600 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Delivery Timeframe</h2>
                  <p className="text-gray-700">
                    Unlike physical products that require shipping time, our ebook is delivered instantly. 
                    You'll have access to your purchase within seconds of completing your transaction, 
                    allowing you to start reading and implementing the strategies right away.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>Delivery Issues</span>
              </h2>
              <p className="text-gray-700 mb-4">
                If you encounter any issues with accessing or downloading your ebook after purchase, please:
              </p>
              <ul className="list-disc ml-5 space-y-2 text-gray-700">
                <li>Check your spam/junk folder for the delivery email</li>
                <li>Verify you've entered the correct email address during purchase</li>
                <li>Log into your account to access the download directly</li>
                <li>Contact our support team through the <Link to="/contact" className="text-primary hover:underline">Contact Page</Link> for immediate assistance</li>
              </ul>
            </section>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-700">
                Have additional questions about our delivery process? Visit our <Link to="/faq" className="text-primary hover:underline">FAQ</Link> or 
                contact our <Link to="/contact" className="text-primary hover:underline">customer support team</Link>.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ShippingDelivery;
