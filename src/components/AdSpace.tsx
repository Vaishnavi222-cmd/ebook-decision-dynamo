
import React, { useEffect, useRef } from "react";
import Container from "./ui/container";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdSpaceProps {
  className?: string;
  position?: "top" | "middle" | "bottom";
}

const AdSpace: React.FC<AdSpaceProps> = ({ 
  className, 
  position = "middle" 
}) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Log whether we're on mobile and the current position for debugging
    console.log(`AdSpace: isMobile=${isMobile}, position=${position}`);
  }, [isMobile, position]);

  return (
    <section className={cn("py-2", className)}>
      <Container>
        <div 
          className={cn(
            "mx-auto overflow-hidden rounded-lg border border-dashed border-primary/20 p-3 text-center bg-secondary/20",
            {
              "max-w-md": position === "middle",
              "max-w-lg": position === "top" || position === "bottom"
            }
          )}
        >
          <div className="text-muted-foreground text-xs font-medium mb-1">
            {`Advertisement Space - ${position}`}
          </div>
          <div 
            ref={adContainerRef}
            className="flex items-center justify-center h-40"
          >
            <span className="text-muted-foreground/50 text-sm">
              {isMobile ? "Mobile ad will appear here" : "Ad content will appear here"}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AdSpace;
