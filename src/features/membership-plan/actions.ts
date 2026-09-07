"use server";

import { revalidatePath } from "next/cache";

import {
  createMembershipPlan,
  deleteMembershipPlan,
  updateMembershipPlan,
} from "@/lib/api/membership-plans";
import type {
  CreateMembershipPlanInput,
  MembershipPlan,
  UpdateMembershipPlanInput,
} from "@/features/membership-plan/types/membership-plan";

export async function createMembershipPlanAction(
  input: CreateMembershipPlanInput
): Promise<MembershipPlan> {
  const plan = await createMembershipPlan(input);
  revalidatePath("/membership-plan");
  return plan;
}

export async function updateMembershipPlanAction(
  id: string,
  patch: UpdateMembershipPlanInput
): Promise<MembershipPlan> {
  const plan = await updateMembershipPlan(id, patch);
  revalidatePath("/membership-plan");
  return plan;
}

export async function deleteMembershipPlanAction(id: string): Promise<void> {
  await deleteMembershipPlan(id);
  revalidatePath("/membership-plan");
}
