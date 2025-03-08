
import React from "react";
import Container from "./ui/container";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-12 border-t">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">DecisionDynamo</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-6 md:mb-0">
            <a
              href="#about"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#features"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact Section
            </a>
            <Link
              to="/contact-us"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/disclaimer"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Disclaimer
            </Link>
            <Link
              to="/terms"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/refund"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Refund & Cancellation
            </Link>
            <Link
              to="/shipping-delivery"
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              Shipping & Delivery
            </Link>
          </nav>

          <div className="text-sm text-muted-foreground">
            &copy; {currentYear} DecisionDynamo. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
