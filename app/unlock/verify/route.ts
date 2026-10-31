import { NextResponse, type NextRequest } from "next/server";

import {
  GATE_COOKIE,
  UNLOCK_PATH,
  cookieOptions,
  expectedToken,
  isValidPasscode,
  safeNext,
} from "@/lib/grad-school-auth";

// The unlock form posts here. 303 so the browser follows up with a GET.
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const next = safeNext(form.get("next"));

  let res: NextResponse;
  if (isValidPasscode(form.get("passcode"))) {
    res = NextResponse.redirect(new URL(next, request.url), 303);
    res.cookies.set(GATE_COOKIE, expectedToken()!, cookieOptions);
  } else {
    const back = new URL(UNLOCK_PATH, request.url);
    back.searchParams.set("next", next);
    back.searchParams.set("error", "1");
    res = NextResponse.redirect(back, 303);
  }
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}
