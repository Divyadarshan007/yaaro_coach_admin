"use client";

import { useMemo, useState } from "react";

import { ExerciseDetailPanel } from "@/features/exercise-library/components/exercise-detail-panel";
import { ExerciseListPanel } from "@/features/exercise-library/components/exercise-list-panel";
import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

export function ExerciseLibraryView({ catalog }: { catalog: ExerciseCatalogEntry[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedExercise = useMemo(
    () => catalog.find((exercise) => exercise._id === selectedId) ?? null,
    [catalog, selectedId]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Exercise Library</h1>
        <p className="text-sm text-muted-foreground">Search for existing exercises, and create your own custom exercises</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <ExerciseListPanel catalog={catalog} selectedId={selectedId} onSelectExercise={setSelectedId} />
        <ExerciseDetailPanel exercise={selectedExercise} />
      </div>
    </div>
  );
}
