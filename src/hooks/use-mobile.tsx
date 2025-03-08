
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Function to check if device is mobile
    const checkMobile = () => {
      const width = window.innerWidth
      const isMobileDevice = width < MOBILE_BREAKPOINT
      console.log(`Window width: ${width}, isMobile: ${isMobileDevice}`)
      setIsMobile(isMobileDevice)
    }
    
    // Check immediately
    checkMobile()
    
    // Add event listener
    window.addEventListener("resize", checkMobile)
    
    // Clean up
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}
