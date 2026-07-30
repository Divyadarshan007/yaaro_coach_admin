import { COACH_BACKEND_URL } from "@/lib/api/config";
import type { Program } from "@/features/program-editor/types/program-editor";

export async function getPrograms(): Promise<Program[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/programs`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch programs (${res.status})`);
  return res.json();
}

export async function getProgram(id: string): Promise<Program | null> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/programs/${id}`, { cache: "no-store" });
  // 404 = doesn't exist; 400 = malformed id (e.g. a stale pre-migration local id
  // still sitting in a browser tab/bookmark). Both just mean "show not-found".
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to fetch program ${id} (${res.status})`);
  return res.json();
}
