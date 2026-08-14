"use server";

import { revalidatePath } from "next/cache";

import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import { assignProgramToClient, removeClientProgram, updateClientProgram } from "@/lib/api/clients";
import type { Program, ProgramPatch } from "@/features/program-editor/types/program-editor";

async function createProgram(body: { sourceProgramId?: string | null }): Promise<Program> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/programs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
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

export async function duplicateProgramAction(sourceProgramId: string): Promise<Program> {
  const program = await createProgram({ sourceProgramId });
  revalidatePath("/program-library");
  return program;
}

export async function updateProgramAction(id: string, patch: ProgramPatch): Promise<Program> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/programs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Failed to update program ${id} (${res.status})`);
  return res.json();
}

// Uploads a program's cover image to temp storage, returning its resolved (absolute)
// URL — submit this straight back as the `image` field on updateProgramAction/
// updateClientProgramAction, which move it out of temp into permanent storage on save.
export async function uploadProgramImageAction(formData: FormData): Promise<string> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }
  const uploadForm = new FormData();
  uploadForm.append("images", file);
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/uploads/images`, {
    method: "POST",
    headers: await getCoachAuthHeaders(),
    body: uploadForm,
  });
  if (!res.ok) throw new Error(`Failed to upload image (${res.status})`);
  const { images } = (await res.json()) as { images: { url: string }[] };
  const url = images[0].url;
  return url.startsWith("/") ? `${COACH_BACKEND_URL}${url}` : url;
}

export async function deleteProgramAction(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/programs/${id}`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to delete program ${id} (${res.status})`);
  revalidatePath("/program-library");
}

export async function updateClientProgramAction(clientId: string, patch: ProgramPatch): Promise<Program> {
  const program = await updateClientProgram(clientId, patch);
  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
  return program;
}

export async function removeClientProgramAction(clientId: string): Promise<void> {
  await removeClientProgram(clientId);
  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
}

export async function replaceClientProgramAction(clientId: string, sourceProgramId: string): Promise<void> {
  await assignProgramToClient(clientId, { sourceProgramId, programStartDate: null });
  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
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
