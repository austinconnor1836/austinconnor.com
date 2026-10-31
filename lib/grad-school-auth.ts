import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Passcode gate for everything under /grad-school/*.
 *
 * The passcode lives only in the GRAD_SCHOOL_PASSCODE env var. The cookie holds
 * an HMAC-SHA256 derived from it, never the passcode itself, so rotating the env
 * var invalidates every old cookie and every old ?key= link at once.
 * If the env var is missing, nothing ever validates: the gate fails closed.
 */

export const GATE_COOKIE = "gs_auth";
export const GATE_PREFIX = "/grad-school/";
export const UNLOCK_PATH = "/unlock";
export const DEFAULT_NEXT = "/grad-school/randolph/greek-1";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

const TOKEN_CONTEXT = "austinconnor.com/grad-school/v1";

/** People type the passcode on phones: ignore case and stray whitespace. */
function normalize(input: string): string {
  return input.trim().toLowerCase();
}

function configuredPasscode(): string | null {
  const value = normalize(process.env.GRAD_SCHOOL_PASSCODE ?? "");
  return value ? value : null;
}

function hmac(passcode: string): Buffer {
  return createHmac("sha256", passcode).update(TOKEN_CONTEXT).digest();
}

/** The cookie value for the current passcode, or null when the gate isn't configured. */
export function expectedToken(): string | null {
  const passcode = configuredPasscode();
  return passcode ? hmac(passcode).toString("hex") : null;
}

/** Constant-time check of a submitted passcode against the env var. */
export function isValidPasscode(input: unknown): boolean {
  const passcode = configuredPasscode();
  if (!passcode || typeof input !== "string") return false;
  const submitted = normalize(input);
  if (!submitted) return false;
  // Both sides are 32-byte digests, so the comparison is fixed-length.
  return timingSafeEqual(hmac(submitted), hmac(passcode));
}

/** Constant-time check of a cookie value. */
export function isValidToken(token: string | null | undefined): boolean {
  const expected = expectedToken();
  if (!expected || typeof token !== "string") return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  maxAge: COOKIE_MAX_AGE,
} as const;

/**
 * Only same-site paths under /grad-school/ are allowed as redirect targets
 * (no open redirect). Returns pathname + search, or DEFAULT_NEXT.
 */
export function safeNext(next: unknown): string {
  if (
    typeof next !== "string" ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.includes("\\")
  ) {
    return DEFAULT_NEXT;
  }
  const base = "https://gate.invalid";
  let url: URL;
  try {
    url = new URL(next, base);
  } catch {
    return DEFAULT_NEXT;
  }
  if (url.origin !== base || !url.pathname.startsWith(GATE_PREFIX)) return DEFAULT_NEXT;
  url.searchParams.delete("key");
  return url.pathname + url.search;
}
