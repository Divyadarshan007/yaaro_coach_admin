import { create } from "zustand";

import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

type ExerciseCatalogState = {
  byId: Map<string, ExerciseCatalogEntry>;
  hydrate: (catalog: ExerciseCatalogEntry[]) => void;
  addEntry: (entry: ExerciseCatalogEntry) => void;
};

// Exercise routines now reference exercises by exerciseId only (no embedded name/muscle),
// so any component rendering a routine needs to resolve that id against the catalog.
// Hydrated once, app-wide, from the (main) layout so every program/routine screen can
// look an entry up without each one re-fetching or prop-drilling the whole catalog.
export const useExerciseCatalogStore = create<ExerciseCatalogState>((set) => ({
  byId: new Map(),
  hydrate: (catalog) => set({ byId: new Map(catalog.map((entry) => [entry._id, entry])) }),
  // Adds a freshly created custom exercise (e.g. from the routine editor) without
  // waiting for the next full hydration, so it resolves immediately everywhere.
  addEntry: (entry) =>
    set((state) => {
      const byId = new Map(state.byId);
      byId.set(entry._id, entry);
      return { byId };
    }),
}));

export function useExerciseCatalogEntry(exerciseId: string): ExerciseCatalogEntry | undefined {
  return useExerciseCatalogStore((state) => state.byId.get(exerciseId));
}
