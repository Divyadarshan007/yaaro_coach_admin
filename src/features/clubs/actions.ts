"use server";

import { revalidatePath } from "next/cache";

import {
  approveClubJoinRequest,
  createClub,
  deleteClub,
  getClubLeaderboard,
  getClubStats,
  joinClub,
  leaveClub,
  rejectClubJoinRequest,
  updateClub,
  uploadClubImage,
} from "@/lib/api/clubs";
import type {
  Club,
  ClubLeaderboardRow,
  ClubStatItem,
  ClubStatPeriod,
  CreateClubInput,
  UpdateClubInput,
} from "@/features/clubs/types/club";

export async function createClubAction(input: CreateClubInput): Promise<Club> {
  const club = await createClub(input);
  revalidatePath("/clubs");
  return club;
}

export async function updateClubAction(id: string, patch: UpdateClubInput): Promise<Club> {
  const club = await updateClub(id, patch);
  revalidatePath("/clubs");
  revalidatePath(`/clubs/${id}`);
  return club;
}

export async function deleteClubAction(id: string): Promise<void> {
  await deleteClub(id);
  revalidatePath("/clubs");
}

export async function approveClubJoinRequestAction(id: string, userId: string): Promise<void> {
  await approveClubJoinRequest(id, userId);
  revalidatePath(`/clubs/${id}`);
}

export async function rejectClubJoinRequestAction(id: string, userId: string): Promise<void> {
  await rejectClubJoinRequest(id, userId);
  revalidatePath(`/clubs/${id}`);
}

export async function joinClubAction(id: string): Promise<void> {
  await joinClub(id);
  revalidatePath("/clubs");
  revalidatePath(`/clubs/${id}`);
}

export async function leaveClubAction(id: string): Promise<void> {
  await leaveClub(id);
  revalidatePath("/clubs");
  revalidatePath(`/clubs/${id}`);
}

export async function getClubStatsAction(
  id: string,
  period: ClubStatPeriod
): Promise<{ stats: ClubStatItem[]; leaderboard: ClubLeaderboardRow[] }> {
  const [stats, leaderboard] = await Promise.all([
    getClubStats(id, period),
    getClubLeaderboard(id, period),
  ]);
  return { stats, leaderboard };
}

export async function uploadClubImageAction(formData: FormData): Promise<string> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }
  return uploadClubImage(file);
}
