import { cookies } from "next/headers";

const SESSION_COOKIE = "coach_session";

// Server-only. Reads the coach_session cookie set by /api/auth/google and forwards it
// as an Authorization header, for the backend calls that are gated behind
// authenticateCoachToken (clients.ts, coach.ts, programs.ts, routines.ts). Not used by
// muscles.ts/exercises.ts, which stay public catalog reads.
export async function getCoachAuthHeaders(): Promise<Record<string, string>> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
