"use server";

import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

// Uploads a custom exercise's thumbnail to temp storage, returning its resolved
// (absolute) URL — submit this straight back as `thumbnailUrl` on
// createCustomExerciseAction, which moves it out of temp into permanent storage.
export async function uploadCustomExerciseImageAction(formData: FormData): Promise<string> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }
  const uploadForm = new FormData();
  uploadForm.append("images", file);
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/uploads/images`, {
    method: "POST",
    headers: await getCoachAuthHeaders(),
    body: uploadForm,
  });
  if (!res.ok) throw new Error(`Failed to upload image (${res.status})`);
  const { images } = (await res.json()) as { images: { url: string }[] };
  const url = images[0].url;
  return url.startsWith("/") ? `${COACH_BACKEND_URL}${url}` : url;
}

export async function createCustomExerciseAction(input: {
  name: string;
  muscleId: string | null;
  otherMusclesId: string[];
  equipmentId: string | null;
  exerciseTypeId: string | null;
  thumbnailUrl: string | null;
}): Promise<ExerciseCatalogEntry> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/custom-exercises`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to create exercise (${res.status})`);
  return res.json();
}

export type CustomExerciseFormOptions = {
  muscles: { id: string; name: string }[];
  equipment: { id: string; name: string }[];
  exerciseTypes: { id: string; name: string; action: string[] }[];
};

// Full canonical option lists for the create-custom-exercise form (as opposed to the
// picker panel's filter dropdowns, which only show muscles/equipment already present
// in the fetched catalog). All three backing routes are public catalog reads.
export async function getCustomExerciseFormOptionsAction(): Promise<CustomExerciseFormOptions> {
  const [musclesRes, equipmentRes, typesRes] = await Promise.all([
    fetch(`${COACH_BACKEND_URL}/coach/v1/muscles`, { cache: "no-store" }),
    fetch(`${COACH_BACKEND_URL}/coach/v1/equipment`, { cache: "no-store" }),
    fetch(`${COACH_BACKEND_URL}/coach/v1/exercise-types`, { cache: "no-store" }),
  ]);
  if (!musclesRes.ok || !equipmentRes.ok || !typesRes.ok) {
    throw new Error("Failed to load exercise form options");
  }
  // The backend's removeVFromSchema plugin (applied to the muscle, equipment, and
  // exerciseType models) transforms `_id` -> `id` on JSON serialization, so all three
  // responses key their documents by `id`, not `_id`.
  const [muscles, equipment, exerciseTypes] = (await Promise.all([
    musclesRes.json(),
    equipmentRes.json(),
    typesRes.json(),
  ])) as [
    { id: string; name: string }[],
    { id: string; name: string }[],
    { id: string; name: string; action: string[] }[],
  ];

  return {
    muscles: muscles.map((m) => ({ id: m.id, name: m.name })),
    equipment: equipment.map((e) => ({ id: e.id, name: e.name })),
    exerciseTypes: exerciseTypes.map((t) => ({ id: t.id, name: t.name, action: t.action })),
  };
}
