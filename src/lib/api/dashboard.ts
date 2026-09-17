import { redirect } from "next/navigation";

import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type { DashboardStats } from "@/features/dashboard/types/dashboard";

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/dashboard/stats`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  // A coach token whose studio no longer exists comes back as 401 (see
  // middlewares/authenticator.js) — the same "please log in again" signal getCoachProfile()
  // already treats as null. Redirect straight to login here too, rather than throwing into
  // the dashboard page's render and racing the layout's own redirect.
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) throw new Error(`Failed to fetch dashboard stats (${res.status})`);
  return res.json();
}
