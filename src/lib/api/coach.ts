import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";

export type CoachProfile = { id: string; name: string; email: string; avatar: string; slug: string };

export async function getCoachProfile(): Promise<CoachProfile | null> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/auth/me`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (res.status === 401 || res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch coach profile (${res.status})`);
  return res.json();
}
