// Server-only — never imported into a "use client" file. All backend calls
// happen from Server Components / Server Actions, so this never reaches the browser.
export const COACH_BACKEND_URL = process.env.COACH_BACKEND_URL || "http://localhost:3200";
