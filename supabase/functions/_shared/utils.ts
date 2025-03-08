
// Base64 encoding utilities for Deno environment

/**
 * Encodes a string to base64 (replacement for browser's btoa)
 */
export function encodeBase64(str: string): string {
  return btoa(str);
}

/**
 * btoa implementation for Deno
 */
export function btoa(input: string): string {
  return encodeBytesToBase64(new TextEncoder().encode(input));
}

/**
 * Encodes bytes to base64 string
 */
export function encodeBytesToBase64(bytes: Uint8Array): string {
  return Base64.encode(bytes);
}

// Base64 implementation
const Base64 = {
  encode(bytes: Uint8Array): string {
    const binString = Array.from(bytes)
      .map(byte => String.fromCharCode(byte))
      .join("");
    return globalThis.btoa(binString);
  }
};
