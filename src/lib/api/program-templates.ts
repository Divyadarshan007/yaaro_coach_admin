import { COACH_BACKEND_URL } from "@/lib/api/config";
import type { YaaroCoachProgram } from "@/features/program-library/types/yaaro-coach-library";

export async function getProgramTemplates(): Promise<YaaroCoachProgram[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/program-templates`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch program templates (${res.status})`);
  return res.json();
}
