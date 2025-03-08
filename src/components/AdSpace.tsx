
import React, { useEffect, useRef } from "react";
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
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only inject the ad script for the header position
    if (position === "header" && adRef.current) {
      // Clear any previous content
      adRef.current.innerHTML = "";
      
      // Create container for the ad
      const adContainer = document.createElement("div");
      adContainer.className = "w-full h-full";
      adRef.current.appendChild(adContainer);
      
      // Create and inject the ad script
      const scriptEl = document.createElement("script");
      scriptEl.innerHTML = `
        (function(xhptg){
          var d = document,
              s = d.createElement('script'),
              l = d.scripts[d.scripts.length - 1];
          s.settings = xhptg || {};
          s.src = "//villainous-appointment.com/b/X.VpsqdKGblw0/YNW/dwiAYNWQ5_uuZdXuIB/NeGmo9BulZhUTlHkbP/TnYUxUNlTzU/wSOxTgg/tFNyjOEb1SNUTLA/5dO/QZ";
          s.async = true;
          s.referrerPolicy = 'no-referrer-when-downgrade';
          l.parentNode.insertBefore(s, l);
        })({})
      `;
      adContainer.appendChild(scriptEl);

      // Clean up function to remove script when component unmounts
      return () => {
        if (adRef.current) {
          adRef.current.innerHTML = "";
        }
      };
    }
  }, [position]);

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
          <div 
            ref={adRef} 
            className={cn(
              "flex items-center justify-center relative",
              position === "header" ? "min-h-[150px] sm:min-h-[200px]" : "min-h-[60px] sm:min-h-[90px]"
            )}
            id={`ad-space-${position}`}
          >
            {position !== "header" && (
              <span className="text-muted-foreground/50">Ad content will appear here</span>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AdSpace;
