import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type { Routine } from "@/features/program-editor/types/program-editor";

export async function getRoutines(visibility?: "mine" | "explore" | "public"): Promise<Routine[]> {
  const query = visibility ? `?visibility=${visibility}` : "";
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/routines${query}`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch routines (${res.status})`);
  return res.json();
}

export async function getRoutine(id: string): Promise<Routine | null> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/routines/${id}`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to fetch routine ${id} (${res.status})`);
  return res.json();
}
