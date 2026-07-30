import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

export type FilterOption = { id: string; label: string };

export function getDistinctEquipment(catalog: ExerciseCatalogEntry[]): FilterOption[] {
  const seen = new Map<string, string>();
  for (const entry of catalog) {
    if (entry.equipmentId && !seen.has(entry.equipmentId._id)) {
      seen.set(entry.equipmentId._id, entry.equipmentId.name);
    }
  }
  return [...seen.entries()]
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getDistinctExerciseMuscles(catalog: ExerciseCatalogEntry[]): FilterOption[] {
  const seen = new Map<string, string>();
  for (const entry of catalog) {
    if (entry.muscleId && !seen.has(entry.muscleId._id)) {
      seen.set(entry.muscleId._id, entry.muscleId.name);
    }
  }
  return [...seen.entries()]
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function filterExerciseCatalog(
  catalog: ExerciseCatalogEntry[],
  { search, equipmentId, muscleId }: { search: string; equipmentId: string | null; muscleId: string | null }
): ExerciseCatalogEntry[] {
  const query = search.trim().toLowerCase();
  return catalog.filter((entry) => {
    if (equipmentId && entry.equipmentId?._id !== equipmentId) return false;
    if (muscleId && entry.muscleId?._id !== muscleId) return false;
    if (query.length === 0) return true;
    return (
      entry.name.toLowerCase().includes(query) ||
      (entry.muscleId?.name.toLowerCase().includes(query) ?? false) ||
      (entry.equipmentId?.name.toLowerCase().includes(query) ?? false)
    );
  });
}
