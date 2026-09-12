import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";

export type ExerciseCatalogEntry = {
  _id: string;
  name: string;
  thumbnailUrl: string;
  isFullBodyweightExercise: boolean;
  muscleId: { _id: string; name: string; muscleGroupId: { _id: string; name: string } | null } | null;
  equipmentId: { _id: string; name: string } | null;
  exerciseTypeId: { _id: string; name: string; action: string[] } | null;
  url: string;
  mediaType: string;
};

// Merges the global catalog with the studio's own custom exercises when a coach
// session is present; falls back to the public mobile catalog otherwise.
export async function getExerciseCatalog(): Promise<ExerciseCatalogEntry[]> {
  const authHeaders = await getCoachAuthHeaders();
  const endpoint = authHeaders.Authorization ? "coach/v1/exercises" : "mobile/v1/exercises";
  const res = await fetch(`${COACH_BACKEND_URL}/${endpoint}`, { headers: authHeaders, cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch exercise catalog (${res.status})`);
  return res.json();
}
