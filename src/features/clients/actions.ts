"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createClientMeasurement,
  getClientAdvancedStats,
  getClientFeeds,
  reassignClientCoach,
  removeClient,
  updateClientNotes,
  uploadClientMeasurementImage,
} from "@/lib/api/clients";
import type { AdvancedStatsGranularity, AdvancedStatsRange, ClientAdvancedStats } from "@/features/clients/types/advanced-stats";
import type { FeedItem } from "@/features/clients/types/workout-feed";
import type { MeasurementInput } from "@/features/clients/types/measurement";

export async function getClientFeedsAction(clientId: string, page: number): Promise<FeedItem[]> {
  return getClientFeeds(clientId, page);
}

export async function getClientAdvancedStatsAction(
  clientId: string,
  params: { granularity: AdvancedStatsGranularity; range: AdvancedStatsRange }
): Promise<ClientAdvancedStats | null> {
  return getClientAdvancedStats(clientId, params);
}

export async function updateClientNotesAction(clientId: string, notes: string): Promise<void> {
  await updateClientNotes(clientId, notes);
  revalidatePath(`/clients/${clientId}`);
}

export async function removeClientAction(clientId: string): Promise<void> {
  await removeClient(clientId);
  revalidatePath("/clients");
  redirect("/clients");
}

// Reassigning hands off the requester's own access to the client (see reassignCoach's
// backend doc comment), so this redirects away the same way removeClientAction does.
export async function reassignClientCoachAction(clientId: string, coachId: string): Promise<void> {
  await reassignClientCoach(clientId, coachId);
  revalidatePath("/clients");
  redirect("/clients");
}

const MEASUREMENT_FIELD_KEYS = [
  "weight",
  "bodyFat",
  "neck",
  "shoulder",
  "chest",
  "leftBiceps",
  "rightBiceps",
  "leftForearm",
  "rightForearm",
  "abdomen",
  "waist",
  "hips",
  "leftThigh",
  "rightThigh",
  "leftCalf",
  "rightCalf",
] as const;

export async function logClientMeasurementAction(clientId: string, formData: FormData): Promise<void> {
  const body: MeasurementInput = { date: String(formData.get("date") ?? "") };

  for (const key of MEASUREMENT_FIELD_KEYS) {
    const value = formData.get(key);
    if (typeof value === "string" && value.trim() !== "") {
      body[key] = value;
    }
  }

  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    body.image = await uploadClientMeasurementImage(imageFile);
  }

  await createClientMeasurement(clientId, body);
  revalidatePath(`/clients/${clientId}`);
}
