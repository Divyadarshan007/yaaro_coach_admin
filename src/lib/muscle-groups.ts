/**
 * Muscle taxonomy is fetched from the backend's real `muscle`/`muscleGroup`
 * collections (GET /coach/v1/muscles, see src/lib/api/muscles.ts) rather than
 * hardcoded here, to avoid duplicating data the backend already owns.
 */
export type MuscleCatalogEntry = {
  id: string;
  name: string;
  thumbnailUrl: string;
  muscleGroupId: string | null;
  muscleGroupName: string;
};

export function buildMuscleLookup(catalog: MuscleCatalogEntry[]): Record<string, MuscleCatalogEntry> {
  return Object.fromEntries(catalog.map((entry) => [entry.id, entry]));
}

export function getMuscleName(catalog: MuscleCatalogEntry[], muscleId: string | null | undefined): string {
  if (!muscleId) return "Unspecified";
  return catalog.find((entry) => entry.id === muscleId)?.name ?? "Unknown";
}

/** Distinct muscle groups (coarse tier) present in the catalog, sorted by label. */
export function getDistinctMuscleGroups(catalog: MuscleCatalogEntry[]): { id: string; label: string }[] {
  const seen = new Map<string, string>();
  for (const entry of catalog) {
    if (entry.muscleGroupId && !seen.has(entry.muscleGroupId)) {
      seen.set(entry.muscleGroupId, entry.muscleGroupName);
    }
  }
  return [...seen.entries()]
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
