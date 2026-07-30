"use server";

import { revalidatePath } from "next/cache";

import { COACH_BACKEND_URL } from "@/lib/api/config";
import { assignProgramToClient } from "@/lib/api/clients";
import type { Program, ProgramRoutine } from "@/features/program-editor/types/program-editor";

async function createProgram(body: { templateId?: string }): Promise<Program> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/programs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to create program (${res.status})`);
  return res.json();
}

export async function createBlankProgramAction(): Promise<string> {
  const program = await createProgram({});
  revalidatePath("/program-library");
  return program.id;
}

export async function createProgramFromTemplateAction(templateId: string): Promise<Program> {
  const program = await createProgram({ templateId });
  revalidatePath("/program-library");
  return program;
}

export async function updateProgramAction(
  id: string,
  patch: Partial<{ title: string; duration: string; note: string; routines: ProgramRoutine[] }>
): Promise<Program> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/programs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Failed to update program ${id} (${res.status})`);
  return res.json();
}

export async function deleteProgramAction(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/programs/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete program ${id} (${res.status})`);
  revalidatePath("/program-library");
}

export async function assignProgramToClientsAction(
  sourceProgramId: string,
  clientIds: string[],
  programStartDate: string | null
): Promise<void> {
  await Promise.all(
    clientIds.map((clientId) => assignProgramToClient(clientId, { sourceProgramId, programStartDate }))
  );
  revalidatePath("/clients");
  for (const clientId of clientIds) revalidatePath(`/clients/${clientId}`);
}
