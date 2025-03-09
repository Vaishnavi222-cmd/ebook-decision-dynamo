
/// <reference types="vite/client" />

// Add Network Information API type declarations
interface NetworkInformation {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  readonly onchange?: EventListener;
}

interface Navigator {
  connection?: NetworkInformation;
}
