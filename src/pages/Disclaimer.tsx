
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/ui/container";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main className="py-20">
        <Container className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Disclaimer</h1>
          <div className="prose prose-slate max-w-none">
            <p className="mb-4">
              The information provided in "The Art of Smart Decisions" eBook is for general informational purposes only. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained in this eBook.
            </p>
            
            <p className="mb-4">
              Any reliance you place on such information is strictly at your own risk. In no event will DecisionDynamo be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from the use of this eBook.
            </p>

            <p className="mb-4">
              This eBook contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
            </p>

            <p className="mb-4">
              All trademarks reproduced in this eBook, which are not the property of, or licensed to the operator, are acknowledged on the eBook.
            </p>

            <p className="mb-4">
              From time to time, this eBook may also include links to other websites or resources. These links are provided for your convenience to provide further information. They do not signify that we endorse these websites. We have no responsibility for the content of the linked websites.
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

export default Disclaimer;
