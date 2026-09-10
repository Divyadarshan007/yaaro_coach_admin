"use server";

import { revalidatePath } from "next/cache";

import {
  createCoachLead,
  createLeadSource,
  deleteCoachLead,
  deleteLeadSource,
  getLeadSources,
  updateCoachLead,
  updateLeadSource,
} from "@/lib/api/coach-leads";
import type {
  CoachLead,
  CreateCoachLeadInput,
  CreateLeadSourceInput,
  LeadSource,
  UpdateCoachLeadInput,
  UpdateLeadSourceInput,
} from "@/features/leads/types/lead";

// Reused outside the Leads feature too — e.g. the Clients page's manual "Add Client"
// form, which shares this same coach-managed source list.
export async function getLeadSourcesAction(): Promise<LeadSource[]> {
  return getLeadSources();
}

export async function createLeadAction(input: CreateCoachLeadInput): Promise<CoachLead> {
  const lead = await createCoachLead(input);
  revalidatePath("/leads");
  return lead;
}

export async function updateLeadAction(id: string, patch: UpdateCoachLeadInput): Promise<CoachLead> {
  const lead = await updateCoachLead(id, patch);
  revalidatePath("/leads");
  return lead;
}

export async function deleteLeadAction(id: string): Promise<void> {
  await deleteCoachLead(id);
  revalidatePath("/leads");
}

export async function createLeadSourceAction(input: CreateLeadSourceInput): Promise<LeadSource> {
  const source = await createLeadSource(input);
  revalidatePath("/leads");
  return source;
}

export async function updateLeadSourceAction(
  id: string,
  patch: UpdateLeadSourceInput
): Promise<LeadSource> {
  const source = await updateLeadSource(id, patch);
  revalidatePath("/leads");
  return source;
}

export async function deleteLeadSourceAction(id: string): Promise<void> {
  await deleteLeadSource(id);
  revalidatePath("/leads");
}
