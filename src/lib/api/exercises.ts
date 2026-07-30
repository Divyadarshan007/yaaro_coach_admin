import { COACH_BACKEND_URL } from "@/lib/api/config";

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

export async function getExerciseCatalog(): Promise<ExerciseCatalogEntry[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/mobile/v1/exercises`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch exercise catalog (${res.status})`);
  return res.json();
}
