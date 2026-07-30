import { cookies } from "next/headers";

const SESSION_COOKIE = "coach_session";

// Server-only. Reads the coach_session cookie set by /api/auth/google and forwards it
// as an Authorization header, for the backend calls (lib/api/clients.ts, coach.ts) that
// are gated behind authenticateCoachToken. Not used by programs.ts/muscles.ts/etc. —
// those routes still run on the DEFAULT_COACH_ID stub and stay unauthenticated.
export async function getCoachAuthHeaders(): Promise<Record<string, string>> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
