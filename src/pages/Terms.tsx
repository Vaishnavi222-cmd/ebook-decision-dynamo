
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
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
          <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>
          <div className="prose prose-slate max-w-none">
            <p className="mb-4">
              Welcome to DecisionDynamo. By purchasing and downloading our eBook "The Art of Smart Decisions", you are agreeing to be bound by the following terms and conditions.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. License</h2>
            <p className="mb-4">
              DecisionDynamo grants you a non-exclusive, non-transferable license to use the eBook for personal, non-commercial purposes. You may not reproduce, distribute, or create derivative works from this eBook without explicit written permission.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Intellectual Property</h2>
            <p className="mb-4">
              All content included in the eBook, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the website, is the property of DecisionDynamo or its suppliers and protected by copyright and other laws.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. Payment Terms</h2>
            <p className="mb-4">
              All prices listed on our website are in Indian Rupees (₹) and are inclusive of applicable taxes. Payment for the eBook must be made at the time of purchase.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. User Obligations</h2>
            <p className="mb-4">
              You agree to use the eBook for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the eBook.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Limitation of Liability</h2>
            <p className="mb-4">
              DecisionDynamo shall not be liable for any direct, indirect, incidental, special, or consequential damages that result from the use of, or the inability to use, the eBook or the content contained therein.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Changes to Terms</h2>
            <p className="mb-4">
              DecisionDynamo reserves the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting to the website.
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

export default Terms;
