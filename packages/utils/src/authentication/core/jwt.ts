import { JwtPayload } from "./types";

function b64urlToStandard(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/"); //b64 url → b64: (- → +) , (_ → /)
  return b64 + "===".slice((b64.length + 3) % 4); //add = padding
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const bin = atob(b64urlToStandard(payload));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

    const json = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/* Expiring token time in miliseconds */
export function getExpMs(token: string): number | undefined {
  const payload = decodeJwtPayload(token);
  return typeof payload?.exp === "number" ? payload.exp * 1000 : undefined;
}
