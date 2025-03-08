
import React, { useEffect, useRef } from "react";
import Container from "./ui/container";
import { cn } from "@/lib/utils";

// Updated interface to explicitly include "header" position
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
      if (adRef.current.childNodes.length > 0) {
        adRef.current.innerHTML = '';
      }
      
      // Create and inject the script element
      const scriptEl = document.createElement("script");
      scriptEl.setAttribute('data-ad-script', 'true');
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
      adRef.current.appendChild(scriptEl);

      // Create a placeholder div to ensure ad has space to render
      const placeholderDiv = document.createElement('div');
      placeholderDiv.id = 'ad-container';
      placeholderDiv.style.width = '100%';
      placeholderDiv.style.minHeight = '60px';
      placeholderDiv.style.display = 'block';
      placeholderDiv.style.overflow = 'hidden';
      adRef.current.appendChild(placeholderDiv);

      // Clean up function to remove script when component unmounts
      return () => {
        const scripts = adRef.current?.querySelectorAll('[data-ad-script="true"]');
        scripts?.forEach(script => script.remove());
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
              "max-w-full": position === "top" || position === "bottom" || position === "header"
            }
          )}
        >
          <div className="text-muted-foreground text-sm font-medium">
            Advertisement Space - {position}
          </div>
          <div 
            ref={adRef} 
            className={cn(
              "min-h-[60px] sm:min-h-[90px] flex items-center justify-center relative",
              {
                "ad-container": position === "header"
              }
            )}
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
