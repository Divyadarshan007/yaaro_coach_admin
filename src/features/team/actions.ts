"use server";

import { revalidatePath } from "next/cache";

import { inviteTeamMember, removeTeamMember, updateTeam, uploadTeamLogoImage } from "@/lib/api/team";
import type { InvitedTeamMember, Team } from "@/features/team/types/team";

export async function inviteTeamMemberAction(email: string): Promise<InvitedTeamMember> {
  const member = await inviteTeamMember(email);
  revalidatePath("/team");
  return member;
}

export async function removeTeamMemberAction(memberId: string): Promise<void> {
  await removeTeamMember(memberId);
  revalidatePath("/team");
}

export async function updateTeamAction(patch: { name?: string; logo?: string }): Promise<Team> {
  const team = await updateTeam(patch);
  // "layout" also revalidates the shared (main) layout, in case the team logo is
  // ever surfaced there — mirrors updateCoachProfileAction's revalidation.
  revalidatePath("/team", "layout");
  return team;
}

export async function uploadTeamLogoAction(formData: FormData): Promise<string> {
  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }
  return uploadTeamLogoImage(file);
}
