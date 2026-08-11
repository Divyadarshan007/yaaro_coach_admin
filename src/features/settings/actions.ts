"use server";

import { revalidatePath } from "next/cache";

import { updateCoachProfile, uploadCoachAvatarImage } from "@/lib/api/coach";
import type { CoachProfile, CoachProfileUpdate } from "@/lib/api/coach";

export async function updateCoachProfileAction(patch: CoachProfileUpdate): Promise<CoachProfile> {
  const updated = await updateCoachProfile(patch);
  // "layout" also revalidates the shared (main) layout, which is where the
  // sidebar's avatar/name are fetched — so it picks up the change immediately.
  revalidatePath("/settings", "layout");
  return updated;
}

export async function uploadCoachAvatarAction(formData: FormData): Promise<string> {
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }
  return uploadCoachAvatarImage(file);
}
