
import React, { useEffect, useRef } from "react";
import Container from "./ui/container";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdSpaceProps {
  className?: string;
  position?: "top" | "middle" | "bottom" | "header";
}

const AdSpace: React.FC<AdSpaceProps> = ({ 
  className, 
  position = "middle" 
}) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Only load the ad script on mobile devices and only for the header position
  useEffect(() => {
    if (isMobile && position === "header" && adContainerRef.current) {
      // Clear the container first
      adContainerRef.current.innerHTML = '';
      
      // Create the script element
      const scriptEl = document.createElement('script');
      scriptEl.innerHTML = `
        (function(luls){
          var d = document,
              s = d.createElement('script'),
              l = d.scripts[d.scripts.length - 1];
          s.settings = luls || {};
          s.src = "//villainous-appointment.com/bXXPV/s-d.Gula0ZYhWOdMiPYNWY5/uWZJXKIW/WeHm/9UuTZXUwlvkuP-TVYGxUNATiUwyfO/DbUQtzNWjuEX1FNSTyI/4/N/gV";
          s.async = true;
          s.referrerPolicy = 'no-referrer-when-downgrade';
          l.parentNode.insertBefore(s, l);
        })({})
      `;
      
      // Append the script to the container
      adContainerRef.current.appendChild(scriptEl);
    }
  }, [isMobile, position]);

  return (
    <section className={cn("py-2", className)}>
      <Container>
        <div 
          className={cn(
            "mx-auto overflow-hidden rounded-lg border border-dashed border-primary/20 p-3 text-center bg-secondary/20",
            {
              "max-w-md": position === "middle",
              "max-w-lg": position === "top" || position === "bottom",
              "max-w-xs": position === "header" // Smaller container for header ad
            }
          )}
        >
          <div className="text-muted-foreground text-xs font-medium mb-1">
            {isMobile && position === "header" ? "Mobile Ad" : `Advertisement Space - ${position}`}
          </div>
          <div 
            ref={adContainerRef}
            className={cn(
              "flex items-center justify-center",
              {
                "h-40": position !== "header",
                "h-[250px] w-[300px] mx-auto": position === "header" // Standard 300x250 mobile ad dimensions
              }
            )}
          >
            {(!isMobile || position !== "header") && (
              <span className="text-muted-foreground/50 text-sm">
                {isMobile ? "Mobile ad will appear here" : "Ad content will appear here"}
              </span>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AdSpace;
