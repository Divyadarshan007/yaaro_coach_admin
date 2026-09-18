"use server";

import { revalidatePath } from "next/cache";

import {
  addStudioMember,
  removeTeamMember,
  updateStudioMember,
  updateTeam,
  uploadTeamLogoImage,
  type RemoveTeamMemberResult,
} from "@/lib/api/team";
import type {
  AddStudioMemberInput,
  Team,
  TeamMember,
  TeamPatch,
  UpdateStudioMemberInput,
} from "@/features/team/types/team";

export async function addStudioMemberAction(input: AddStudioMemberInput): Promise<TeamMember> {
  const member = await addStudioMember(input);
  revalidatePath("/team");
  return member;
}

export async function updateStudioMemberAction(
  memberId: string,
  patch: UpdateStudioMemberInput,
): Promise<TeamMember> {
  const member = await updateStudioMember(memberId, patch);
  revalidatePath("/team");
  return member;
}

export async function removeTeamMemberAction(
  memberId: string,
  replacementCoachId?: string,
): Promise<RemoveTeamMemberResult> {
  const result = await removeTeamMember(memberId, replacementCoachId);
  if (result.ok) {
    revalidatePath("/team");
  }
  return result;
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
