
import React from "react";
import Container from "./ui/container";
import { cn } from "@/lib/utils";

interface AdSpaceProps {
  className?: string;
  position?: "top" | "middle" | "bottom" | "header";
}

const AdSpace: React.FC<AdSpaceProps> = ({ 
  className, 
  position = "middle" 
}) => {
  // This component is designed to be a placeholder for future ad content
  // In a real implementation, this would interface with an ad network
  return (
    <section className={cn("py-4", className)}>
      <Container>
        <div 
          className={cn(
            "w-full mx-auto overflow-hidden rounded-xl border border-dashed border-primary/20 p-4 text-center bg-secondary/20",
            {
              "max-w-3xl": position === "middle",
              "max-w-full": position === "top" || position === "bottom" || position === "header",
              "pt-20": position === "header"
            }
          )}
        >
          <div className="text-muted-foreground text-sm font-medium">
            Advertisement Space - {position}
          </div>
          <div className="h-12 sm:h-16 flex items-center justify-center">
            <span className="text-muted-foreground/50">Ad content will appear here</span>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AdSpace;
