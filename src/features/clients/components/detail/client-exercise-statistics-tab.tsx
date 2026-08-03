"use client";

import { useMemo, useState } from "react";

import { ClientExerciseDetailPanel } from "@/features/clients/components/detail/client-exercise-detail-panel";
import { ClientExerciseListPanel } from "@/features/clients/components/detail/client-exercise-list-panel";
import { getRecentExercisesFromFeeds } from "@/features/clients/lib/recent-exercises";
import type { ExerciseListEntry } from "@/features/clients/types/exercise-stats";
import type { FeedItem } from "@/features/clients/types/workout-feed";
import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

export function ClientExerciseStatisticsTab({
  catalog,
  initialFeeds,
}: {
  catalog: ExerciseCatalogEntry[];
  initialFeeds: FeedItem[];
}) {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseListEntry | null>(null);

  const recentExercises = useMemo(
    () => getRecentExercisesFromFeeds(initialFeeds, catalog),
    [initialFeeds, catalog]
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      <ClientExerciseListPanel
        catalog={catalog}
        recentExercises={recentExercises}
        selectedId={selectedExercise?.id ?? null}
        onSelectExercise={setSelectedExercise}
      />
      <ClientExerciseDetailPanel exercise={selectedExercise} />
    </div>
  );
}
