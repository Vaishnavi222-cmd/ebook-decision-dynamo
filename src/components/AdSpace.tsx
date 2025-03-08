
import React from "react";
import Container from "./ui/container";
import { cn } from "@/lib/utils";

interface AdSpaceProps {
  className?: string;
  position?: "top" | "middle" | "bottom";
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
              "max-w-lg": position === "top" || position === "bottom"
            }
          )}
        >
          <div className="text-muted-foreground text-xs font-medium mb-1">
            {`Advertisement Space - ${position}`}
          </div>
          <div 
            className={cn(
              "flex items-center justify-center h-40"
            )}
          >
            <span className="text-muted-foreground/50 text-sm">
              Ad content placeholder
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AdSpace;
