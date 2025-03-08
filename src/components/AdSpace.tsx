
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
      // Use corrected script format to ensure proper rendering
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

      // Create and append an iframe to ensure ad visibility
      const adFrame = document.createElement('iframe');
      adFrame.id = 'ad-frame';
      adFrame.style.width = '100%';
      adFrame.style.height = '60px';
      adFrame.style.border = 'none';
      adFrame.style.overflow = 'hidden';
      adFrame.style.display = 'block';
      adFrame.setAttribute('allowtransparency', 'true');
      adFrame.setAttribute('frameborder', '0');
      adFrame.setAttribute('scrolling', 'no');
      adFrame.setAttribute('marginheight', '0');
      adFrame.setAttribute('marginwidth', '0');
      
      // Auto-resize iframe content based on the content inside
      adFrame.onload = () => {
        try {
          // Force a redraw of the frame to ensure content visibility
          adFrame.style.height = '61px';
          setTimeout(() => {
            adFrame.style.height = '60px';
          }, 100);
        } catch (e) {
          console.error('Error adjusting iframe:', e);
        }
      };
      
      adRef.current.appendChild(adFrame);
      
      // Clean up function to remove script and iframe when component unmounts
      return () => {
        const scripts = adRef.current?.querySelectorAll('[data-ad-script="true"]');
        scripts?.forEach(script => script.remove());
        const frame = document.getElementById('ad-frame');
        if (frame && frame.parentNode) {
          frame.parentNode.removeChild(frame);
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
            style={{
              overflow: 'visible',
              position: 'relative',
              zIndex: 5
            }}
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
