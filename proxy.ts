import { NextResponse, type NextRequest } from "next/server";

import {
  GATE_COOKIE,
  UNLOCK_PATH,
  cookieOptions,
  expectedToken,
  isValidPasscode,
  isValidToken,
} from "@/lib/grad-school-auth";

// Gate for /grad-school/*. Runs on every matching request (HTML, RSC and
// prefetch alike) before any prerendered page is served.
export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const key = url.searchParams.get("key");

  if (key !== null) {
    const clean = url.clone();
    clean.searchParams.delete("key");
    if (isValidPasscode(key)) {
      // Set the cookie and drop the secret from the address bar and history.
      const res = NextResponse.redirect(clean, 302);
      res.cookies.set(GATE_COOKIE, expectedToken()!, cookieOptions);
      return noStore(res);
    }
    return toUnlock(request, clean.pathname + clean.search, true);
  }

  if (isValidToken(request.cookies.get(GATE_COOKIE)?.value)) {
    return noStore(NextResponse.next());
  }

  return toUnlock(request, url.pathname + url.search, false);
}

function toUnlock(request: NextRequest, next: string, wrongKey: boolean) {
  const target = new URL(UNLOCK_PATH, request.url);
  target.searchParams.set("next", next);
  if (wrongKey) target.searchParams.set("error", "1");
  return noStore(NextResponse.redirect(target, 302));
}

// Locked pages must never sit in a shared cache.
function noStore(res: NextResponse) {
  res.headers.set("Cache-Control", "private, no-store, max-age=0");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: "/grad-school/:path*",
};
