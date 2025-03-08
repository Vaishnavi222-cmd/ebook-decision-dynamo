
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
  return (
    <section className={cn("py-2", className)}>
      <Container>
        <div 
          className={cn(
            "mx-auto overflow-hidden rounded-lg border border-dashed border-primary/20 p-3 text-center bg-secondary/20",
            {
              "max-w-md": position === "middle",
              "max-w-lg": position === "top" || position === "bottom" || position === "header"
            }
          )}
        >
          <div className="text-muted-foreground text-xs font-medium mb-1">
            Advertisement Space - {position}
          </div>
          <div 
            className="h-40 flex items-center justify-center"
          >
            <span className="text-muted-foreground/50 text-sm">Ad content will appear here</span>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AdSpace;
