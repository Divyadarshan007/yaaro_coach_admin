import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "coach_session";
// Redirects a logged-in coach away from these (e.g. /login makes no sense once signed in).
const PUBLIC_PATHS = ["/login"];
// Public Grow contact-form landing page — /{slug}/join, e.g. /h1gyms/join. Unlike
// PUBLIC_PATHS, a signed-in coach must still be able to view this (the "Preview"
// button on /grow opens their own join link in the same browser), so it's exempt
// from the "redirect logged-in users away" rule below, not just the login gate.
const PUBLIC_PATH_PATTERNS = [/^\/[^/]+\/join$/];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isPublicPagePattern = PUBLIC_PATH_PATTERNS.some((pattern) => pattern.test(pathname));

  if (!hasSession && !isPublicPath && !isPublicPagePattern) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|yaaro-icon.png).*)"],
};
