
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
  
  // Load appropriate ad scripts based on position and device
  useEffect(() => {
    if (adContainerRef.current) {
      // Clear the container first
      adContainerRef.current.innerHTML = '';
      
      // Only load ad scripts for specific positions
      if (position === "bottom" && isMobile) {
        // Create a script element for the bottom mobile ad
        const script = document.createElement('script');
        script.innerHTML = `
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
        adContainerRef.current.appendChild(script);
        console.log("Mobile ad script inserted for bottom position");
      }
      
      // Middle position ad script for all devices
      if (position === "middle") {
        const script = document.createElement('script');
        script.innerHTML = `
          (function(esr){
            var d = document,
                s = d.createElement('script'),
                l = d.scripts[d.scripts.length - 1];
            s.settings = esr || {};
            s.src = "//villainous-appointment.com/byXnV.sEdrGdl-0qYgWpdWi/YOW/5cuZZjXWIn/FeUmX9Pu/ZCUglCkaPfTrYbx/NKTFUGygOWTyQGtyN/j/Er1/NsTtIt5ENzQf";
            s.async = true;
            s.referrerPolicy = 'no-referrer-when-downgrade';
            l.parentNode.insertBefore(s, l);
          })({})
        `;
        adContainerRef.current.appendChild(script);
        console.log("Ad script inserted for middle position");
      }
    }
  }, [isMobile, position]);

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
            className={cn(
              "flex items-center justify-center",
              {
                "h-40": position !== "bottom" || !isMobile,
                "h-[250px] w-[300px] mx-auto": position === "bottom" && isMobile, // Standard 300x250 mobile ad dimensions for bottom position
                "h-[250px] w-[300px] mx-auto": position === "middle" // Standard ad dimensions for middle position
              }
            )}
          >
            {(position === "top" || (position !== "middle" && !isMobile && position !== "bottom")) && (
              <span className="text-muted-foreground/50 text-sm">
                Ad content will appear here
              </span>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AdSpace;
