"use client";

import { useMemo, useState } from "react";

import { ExerciseDetailPanel } from "@/features/exercise-library/components/exercise-detail-panel";
import { ExerciseListPanel } from "@/features/exercise-library/components/exercise-list-panel";
import { useExerciseCatalogStore } from "@/lib/exercise-catalog-store";
import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

export function ExerciseLibraryView({ catalog }: { catalog: ExerciseCatalogEntry[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Exercises created via the "Custom Exercise" dialog during this session — merged
  // ahead of the server-fetched catalog so they show up immediately without a refetch
  // (same pattern as routine-editor's ExercisePickerPanel).
  const [customCreated, setCustomCreated] = useState<ExerciseCatalogEntry[]>([]);
  const addToCatalogStore = useExerciseCatalogStore((state) => state.addEntry);

  const fullCatalog = useMemo(() => [...customCreated, ...catalog], [customCreated, catalog]);
  const selectedExercise = useMemo(
    () => fullCatalog.find((exercise) => exercise._id === selectedId) ?? null,
    [fullCatalog, selectedId]
  );

  function handleExerciseCreated(exercise: ExerciseCatalogEntry) {
    setCustomCreated((prev) => [exercise, ...prev]);
    addToCatalogStore(exercise);
    setSelectedId(exercise._id);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Exercise Library</h1>
        <p className="text-sm text-muted-foreground">Search for existing exercises, and create your own custom exercises</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <ExerciseListPanel
          catalog={fullCatalog}
          selectedId={selectedId}
          onSelectExercise={setSelectedId}
          onExerciseCreated={handleExerciseCreated}
        />
        <ExerciseDetailPanel exercise={selectedExercise} />
      </div>
    </div>
  );
}
