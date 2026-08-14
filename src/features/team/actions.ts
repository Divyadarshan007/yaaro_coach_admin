"use server";

import { revalidatePath } from "next/cache";

import { inviteTeamMember, removeTeamMember, updateTeam } from "@/lib/api/team";
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

export async function updateTeamAction(name: string): Promise<Team> {
  const team = await updateTeam({ name });
  revalidatePath("/team");
  return team;
}
