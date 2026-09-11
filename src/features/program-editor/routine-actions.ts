"use server";

import { revalidatePath } from "next/cache";

import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type { Routine, RoutinePatch } from "@/features/program-editor/types/program-editor";

// Backend validation failures (400) return `{ message, errors }` — surface that detail
// instead of an opaque status code so the actual field errors are visible in logs.
async function routineError(action: string, res: Response): Promise<Error> {
  let detail = "";
  try {
    const body = await res.json();
    detail = body?.errors ? `: ${JSON.stringify(body.errors)}` : body?.message ? `: ${body.message}` : "";
  } catch {
    // non-JSON body — status alone will have to do
  }
  return new Error(`Failed to ${action} (${res.status})${detail}`);
}

export async function createRoutineAction(body: { title: string; notes?: string }): Promise<Routine> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/routines`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await routineError("create routine", res);
  const routine: Routine = await res.json();
  revalidatePath("/program-library");
  return routine;
}

// Deep-clones a routine (own or public) into a new private routine owned by the caller —
// used when adding a public routine to your own library, mirroring the deep-clone (not
// share-by-reference) behavior used everywhere else a routine crosses ownership.
export async function duplicateRoutineAction(sourceRoutineId: string): Promise<Routine> {
  const sourceRes = await fetch(`${COACH_BACKEND_URL}/coach/v1/routines/${sourceRoutineId}`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!sourceRes.ok) throw await routineError(`fetch routine ${sourceRoutineId}`, sourceRes);
  const source: Routine = await sourceRes.json();

  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/routines`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify({ title: source.title, notes: source.notes, exercises: source.exercises }),
  });
  if (!res.ok) throw await routineError(`duplicate routine ${sourceRoutineId}`, res);
  const routine: Routine = await res.json();
  revalidatePath("/program-library");
  return routine;
}

export async function updateRoutineAction(id: string, patch: RoutinePatch): Promise<Routine> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/routines/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw await routineError(`update routine ${id}`, res);
  return res.json();
}

export async function deleteRoutineAction(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/routines/${id}`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  // A 404 here means it's already gone (e.g. deleted from another tab, or a stale local
  // list entry) — the end state the caller wanted is already true, so treat it as a
  // no-op success rather than crashing the page over something that isn't an error.
  if (!res.ok && res.status !== 404) throw await routineError(`delete routine ${id}`, res);
  revalidatePath("/program-library");
}
