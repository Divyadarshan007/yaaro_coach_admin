import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type { DashboardStats } from "@/features/dashboard/types/dashboard";

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/dashboard/stats`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch dashboard stats (${res.status})`);
  return res.json();
}
