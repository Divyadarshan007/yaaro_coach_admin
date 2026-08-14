import { create } from "zustand";

import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

type ExerciseCatalogState = {
  byId: Map<string, ExerciseCatalogEntry>;
  hydrate: (catalog: ExerciseCatalogEntry[]) => void;
};

// Exercise routines now reference exercises by exerciseId only (no embedded name/muscle),
// so any component rendering a routine needs to resolve that id against the catalog.
// Hydrated once, app-wide, from the (main) layout so every program/routine screen can
// look an entry up without each one re-fetching or prop-drilling the whole catalog.
export const useExerciseCatalogStore = create<ExerciseCatalogState>((set) => ({
  byId: new Map(),
  hydrate: (catalog) => set({ byId: new Map(catalog.map((entry) => [entry._id, entry])) }),
}));

export function useExerciseCatalogEntry(exerciseId: string): ExerciseCatalogEntry | undefined {
  return useExerciseCatalogStore((state) => state.byId.get(exerciseId));
}
