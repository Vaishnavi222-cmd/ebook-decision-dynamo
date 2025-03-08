
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Download, FileCheck, Timer, AlertTriangle } from "lucide-react";

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
                  <li><strong>Direct Download:</strong> You'll be automatically redirected to a secure download page where you can immediately download your ebook.</li>
                  <li><strong>No Email Required:</strong> Your ebook will be available for immediate download directly from our website without requiring an email address.</li>
                  <li><strong>Accessible Format:</strong> Your ebook will be delivered in PDF format, compatible with most devices and readers.</li>
                </ol>
              </div>
            </section>

            <section className="bg-green-50 p-6 rounded-lg border border-green-100">
              <div className="flex items-start gap-4">
                <Timer className="h-8 w-8 text-green-600 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Immediate Access & Limited Link Validity</h2>
                  <p className="text-gray-700">
                    Unlike physical products that require shipping time, our ebook is delivered instantly. 
                    You'll have access to your purchase immediately after completing your transaction, 
                    allowing you to start reading and implementing the strategies right away.
                  </p>
                  <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <p className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-800">
                        <strong>Important:</strong> Your download link will be valid for 24 hours only. Please download your ebook immediately after purchase to ensure you don't lose access.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-amber-50 p-6 rounded-lg border border-amber-100">
              <h2 className="text-xl font-semibold mb-3">Download Instructions</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <span>Complete your purchase via our secure payment gateway</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <span>Wait for the automatic redirect to the download page (this happens immediately after payment)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span>Click the download button to save the PDF to your device</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-amber-200 text-amber-800 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                  <span>Save the file to a location you'll remember on your device</span>
                </li>
              </ul>
            </section>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-3">Technical Requirements</h2>
              <p className="text-gray-700 mb-4">
                To successfully download and view your ebook, you'll need:
              </p>
              <ul className="list-disc ml-5 space-y-2 text-gray-700">
                <li>A device with internet connection</li>
                <li>PDF reader software (most devices have this built-in)</li>
                <li>Sufficient storage space (typically less than 10MB)</li>
              </ul>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center">
              <h3 className="font-semibold text-lg mb-2">Having Trouble?</h3>
              <p className="text-gray-700">
                If you encounter any issues with downloading your ebook after purchase, please 
                contact our <Link to="/contact-us" className="text-primary hover:underline">customer support team</Link> immediately.
                Remember, your download link is only valid for 24 hours after purchase.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ShippingDelivery;
