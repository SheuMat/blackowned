import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

/**
 * Members-only gate for Business Support subpages.
 *
 * This is an optimistic check: it only looks for the session cookie so
 * signed-out visitors are sent to the login page straight away. The real
 * check (signature + expiry) happens in each page with hasRole("member").
 * The /business-support landing page is not matched: it stays public as a
 * teaser and shows the hub itself when a member is signed in.
 *
 * The cookie name comes from src/lib/session-cookie.ts, shared with
 * src/lib/session.ts (which is server-only and uses node:crypto).
 */

export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const login = new URL("/members/login", request.url);
  login.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/business-support/:path+"],
};
