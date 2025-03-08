
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
    // Only inject the ad script for the header and top positions
    if ((position === "header" || position === "top") && adRef.current) {
      // Clear any previous content
      if (adRef.current.childNodes.length > 0) {
        adRef.current.innerHTML = '';
      }
      
      // Create the iframe first to ensure it's ready for ad content
      const adFrame = document.createElement('iframe');
      adFrame.id = position === "header" ? 'header-ad-frame' : 'top-ad-frame';
      adFrame.style.width = '100%';
      adFrame.style.height = '100%'; // Use 100% height to fill container
      adFrame.style.border = 'none';
      adFrame.style.overflow = 'hidden';
      adFrame.style.display = 'block';
      adFrame.setAttribute('allowtransparency', 'true');
      adFrame.setAttribute('frameborder', '0');
      adFrame.setAttribute('scrolling', 'no');
      adFrame.setAttribute('marginheight', '0');
      adFrame.setAttribute('marginwidth', '0');
      
      adRef.current.appendChild(adFrame);
      
      // Wait for iframe to load before injecting the script
      adFrame.onload = () => {
        try {
          // Get the iframe document
          const iframeDoc = adFrame.contentDocument || adFrame.contentWindow?.document;
          
          if (iframeDoc) {
            // Create a full HTML structure in the iframe
            iframeDoc.open();
            iframeDoc.write(`
              <html>
                <head>
                  <style>
                    body {
                      margin: 0;
                      padding: 0;
                      width: 100%;
                      height: 100%;
                      overflow: hidden;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    }
                    .ad-container {
                      width: 100%;
                      height: 100%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      position: relative;
                    }
                  </style>
                </head>
                <body>
                  <div class="ad-container"></div>
                </body>
              </html>
            `);
            iframeDoc.close();
            
            // Get the container where we'll inject the ad
            const adContainer = iframeDoc.querySelector('.ad-container');
            
            if (adContainer) {
              // Create and inject the script element into the iframe body
              const scriptEl = document.createElement("script");
              scriptEl.setAttribute('data-ad-script', 'true');
              
              // Use different script based on position
              if (position === "header") {
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
              } else if (position === "top") {
                scriptEl.innerHTML = `
                  (function(nkb){
                    var d = document,
                        s = d.createElement('script'),
                        l = d.scripts[d.scripts.length - 1];
                    s.settings = nkb || {};
                    s.src = "//villainous-appointment.com/bJXAV.s-diGXl-0lYjWYd/ikY/WV5YunZYX/Ix/PeZmv9HuJZZUtlWkGPMTDYjxqNvThUmx/OmDoIitUNxjDET1FNXTjEi4/Mzwg";
                    s.async = true;
                    s.referrerPolicy = 'no-referrer-when-downgrade';
                    l.parentNode.insertBefore(s, l);
                  })({})
                `;
              }
              
              // Append the script to the iframe container
              adContainer.appendChild(scriptEl);
              
              // Also add a fallback visible content in case script doesn't render
              const fallbackDiv = document.createElement('div');
              fallbackDiv.style.width = '100%';
              fallbackDiv.style.height = '100%';
              fallbackDiv.style.backgroundColor = '#f0f0f0';
              fallbackDiv.style.display = 'flex';
              fallbackDiv.style.alignItems = 'center';
              fallbackDiv.style.justifyContent = 'center';
              fallbackDiv.style.cursor = 'pointer';
              fallbackDiv.innerHTML = '<span style="color:#555;">Advertisement</span>';
              
              // Only add fallback if no content is generated after a short delay
              setTimeout(() => {
                if (adContainer.childNodes.length <= 1) {
                  adContainer.appendChild(fallbackDiv);
                }
              }, 1000);
            }
          }
        } catch (e) {
          console.error('Error setting up iframe content:', e);
        }
      };
      
      // Clean up function to remove iframe when component unmounts
      return () => {
        const frameId = position === "header" ? 'header-ad-frame' : 'top-ad-frame';
        const frame = document.getElementById(frameId);
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
              "w-full h-full"
            )}
            style={{
              overflow: 'visible',
              position: 'relative',
              zIndex: 5
            }}
          >
            {position !== "header" && position !== "top" && (
              <span className="text-muted-foreground/50">Ad content will appear here</span>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AdSpace;
