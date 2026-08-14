"use server";

import { revalidatePath } from "next/cache";

import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type { Routine, RoutinePatch } from "@/features/program-editor/types/program-editor";

export async function createRoutineAction(body: { title: string; notes?: string }): Promise<Routine> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/routines`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to create routine (${res.status})`);
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
  if (!sourceRes.ok) throw new Error(`Failed to fetch routine ${sourceRoutineId} (${sourceRes.status})`);
  const source: Routine = await sourceRes.json();

  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/routines`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify({ title: source.title, notes: source.notes, exercises: source.exercises }),
  });
  if (!res.ok) throw new Error(`Failed to duplicate routine ${sourceRoutineId} (${res.status})`);
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
  if (!res.ok) throw new Error(`Failed to update routine ${id} (${res.status})`);
  return res.json();
}

export async function deleteRoutineAction(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/routines/${id}`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to delete routine ${id} (${res.status})`);
  revalidatePath("/program-library");
}
