"use server";

import { revalidatePath } from "next/cache";

import { submitPublicLead, updateLeadStatus } from "@/lib/api/leads";

// "layout" so the sidebar's pending-leads badge ((main)/layout.tsx) refreshes too,
// not just the /grow page content — declining/inviting changes the pending count.
export async function declineLeadAction(id: string): Promise<void> {
  await updateLeadStatus(id, "declined");
  revalidatePath("/grow", "layout");
}

export async function inviteLeadAction(id: string): Promise<void> {
  await updateLeadStatus(id, "invited");
  revalidatePath("/grow", "layout");
}

// Called from the public, unauthenticated /[slug]/join page — no coach session involved.
export async function submitLeadAction(
  slug: string,
  data: { name: string; email: string; message: string; acceptedTerms: boolean }
): Promise<void> {
  await submitPublicLead(slug, data);
}
