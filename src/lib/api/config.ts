// Server-only — never imported into a "use client" file. All backend calls
// happen from Server Components / Server Actions, so this never reaches the browser.
export const COACH_BACKEND_URL = process.env.COACH_BACKEND_URL || "http://localhost:3200";

// Public — this app's own origin, used to build the coach's shareable "/[slug]/join"
// link (safe to use in "use client" components).
export const PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
