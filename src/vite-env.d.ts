
/// <reference types="vite/client" />

// Add Network Information API type definitions
interface NetworkInformation {
  readonly downlink: number;
  readonly effectiveType: string; // '2g', '3g', '4g', or 'slow-2g'
  readonly rtt: number;
  readonly saveData: boolean;
  readonly type: string;
  onchange: Event;
}

interface Navigator {
  readonly connection?: NetworkInformation;
}
