"use server";

import { revalidatePath } from "next/cache";

import {
  inviteStudioMember,
  removeTeamMember,
  searchStudioUsers,
  updateTeam,
  uploadTeamLogoImage,
} from "@/lib/api/team";
import type { StudioUserSearchResult, Team, TeamMember, TeamPatch } from "@/features/team/types/team";

export async function searchStudioUsersAction(username: string): Promise<StudioUserSearchResult[]> {
  const term = username.trim();
  if (!term) return [];
  return searchStudioUsers(term);
}

export async function inviteStudioMemberAction(userId: string): Promise<TeamMember> {
  const member = await inviteStudioMember(userId);
  revalidatePath("/team");
  return member;
}

export async function removeTeamMemberAction(memberId: string): Promise<void> {
  await removeTeamMember(memberId);
  revalidatePath("/team");
}

export async function updateTeamAction(patch: TeamPatch): Promise<Team> {
  const team = await updateTeam(patch);
  // "layout" also revalidates the shared (main) layout, in case the studio logo is
  // ever surfaced there — mirrors updateCoachProfileAction's revalidation.
  revalidatePath("/team", "layout");
  revalidatePath("/studio");
  return team;
}

export async function uploadTeamLogoAction(formData: FormData): Promise<string> {
  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }
  return uploadTeamLogoImage(file);
}
