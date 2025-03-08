
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
    // Only inject the ad script for the header and top positions
    if ((position === "header" || position === "top") && adRef.current) {
      // Clear any previous content
      if (adRef.current.childNodes.length > 0) {
        adRef.current.innerHTML = '';
      }
      
      // Create a container div with fixed dimensions for standard ad units
      const adContainer = document.createElement('div');
      adContainer.className = 'ad-container';
      adContainer.style.width = '100%';
      adContainer.style.height = '100%';
      adContainer.style.display = 'flex';
      adContainer.style.alignItems = 'center';
      adContainer.style.justifyContent = 'center';
      adContainer.style.overflow = 'hidden';
      adContainer.style.position = 'relative';
      adRef.current.appendChild(adContainer);
      
      // Create an iframe to isolate the ad content
      const adFrame = document.createElement('iframe');
      adFrame.id = position === "header" ? 'header-ad-frame' : 'top-ad-frame';
      adFrame.style.width = '300px'; // Standard ad width
      adFrame.style.height = '250px'; // Standard ad height
      adFrame.style.border = 'none';
      adFrame.style.overflow = 'hidden';
      adFrame.style.maxWidth = '100%';
      adFrame.style.maxHeight = '100%';
      adFrame.style.display = 'block';
      adFrame.style.margin = '0 auto'; // Center the ad
      adFrame.setAttribute('allowtransparency', 'true');
      adFrame.setAttribute('frameborder', '0');
      adFrame.setAttribute('scrolling', 'no');
      adFrame.setAttribute('marginheight', '0');
      adFrame.setAttribute('marginwidth', '0');
      
      adContainer.appendChild(adFrame);
      
      // Wait for iframe to load before injecting the script
      adFrame.onload = () => {
        try {
          // Get the iframe document
          const iframeDoc = adFrame.contentDocument || adFrame.contentWindow?.document;
          
          if (iframeDoc) {
            // Create a full HTML structure in the iframe
            iframeDoc.open();
            iframeDoc.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    html, body {
                      margin: 0;
                      padding: 0;
                      width: 100%;
                      height: 100%;
                      overflow: hidden;
                    }
                    .ad-wrapper {
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
                  <div class="ad-wrapper"></div>
                </body>
              </html>
            `);
            iframeDoc.close();
            
            // Get the container where we'll inject the ad
            const adWrapper = iframeDoc.querySelector('.ad-wrapper');
            
            if (adWrapper) {
              // Create and inject the script element into the iframe body
              const scriptEl = iframeDoc.createElement("script");
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
              adWrapper.appendChild(scriptEl);
              
              // Add a fallback visible message in case script doesn't render
              const fallbackDiv = iframeDoc.createElement('div');
              fallbackDiv.style.position = 'absolute';
              fallbackDiv.style.top = '0';
              fallbackDiv.style.left = '0';
              fallbackDiv.style.width = '100%';
              fallbackDiv.style.height = '100%';
              fallbackDiv.style.backgroundColor = '#f0f0f0';
              fallbackDiv.style.display = 'flex';
              fallbackDiv.style.alignItems = 'center';
              fallbackDiv.style.justifyContent = 'center';
              fallbackDiv.style.zIndex = '-1'; // Behind the ad
              fallbackDiv.innerHTML = '<span style="color:#555;">Advertisement</span>';
              
              adWrapper.appendChild(fallbackDiv);
            }
          }
        } catch (e) {
          console.error('Error setting up iframe content:', e);
        }
      };
      
      // Clean up function to remove iframe when component unmounts
      return () => {
        if (adRef.current) {
          adRef.current.innerHTML = '';
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
            className="min-h-[260px] flex items-center justify-center relative"
            style={{
              overflow: 'hidden',
              position: 'relative'
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
