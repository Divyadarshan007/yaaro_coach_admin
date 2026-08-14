"use client";

import { useEffect } from "react";

import { useExerciseCatalogStore } from "@/lib/exercise-catalog-store";
import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

export function ExerciseCatalogHydrator({ catalog }: { catalog: ExerciseCatalogEntry[] }) {
  const hydrate = useExerciseCatalogStore((state) => state.hydrate);

  useEffect(() => {
    hydrate(catalog);
  }, [catalog, hydrate]);

  return null;
}
