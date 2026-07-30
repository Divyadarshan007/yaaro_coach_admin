import { COACH_BACKEND_URL } from "@/lib/api/config";
import type { MuscleCatalogEntry } from "@/lib/muscle-groups";

export async function getMuscleCatalog(): Promise<MuscleCatalogEntry[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/muscles`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch muscle catalog (${res.status})`);
  return res.json();
}
