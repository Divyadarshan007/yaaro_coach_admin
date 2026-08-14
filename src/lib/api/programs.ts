import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type { Program } from "@/features/program-editor/types/program-editor";

// Uploaded program images come back as backend-relative paths (e.g. "/uploads/program/x.jpg"),
// which the browser can't load directly — resolve them against COACH_BACKEND_URL here,
// server-side, same as coach.ts does for the coach's own avatar.
function resolveProgramImageUrl(program: Program): Program {
  if (program.image && program.image.startsWith("/")) {
    return { ...program, image: `${COACH_BACKEND_URL}${program.image}` };
  }
  return program;
}

export async function getPrograms(visibility?: "mine" | "explore" | "public"): Promise<Program[]> {
  const query = visibility ? `?visibility=${visibility}` : "";
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/programs${query}`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch programs (${res.status})`);
  const programs: Program[] = await res.json();
  return programs.map(resolveProgramImageUrl);
}

export async function getProgram(id: string): Promise<Program | null> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/programs/${id}`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  // 404 = doesn't exist; 400 = malformed id (e.g. a stale pre-migration local id
  // still sitting in a browser tab/bookmark). Both just mean "show not-found".
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to fetch program ${id} (${res.status})`);
  const program: Program = await res.json();
  return resolveProgramImageUrl(program);
}
