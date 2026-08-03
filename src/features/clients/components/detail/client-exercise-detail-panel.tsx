import { BarChart3, Dumbbell } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import type { ExerciseListEntry } from "@/features/clients/types/exercise-stats";

export function ClientExerciseDetailPanel({ exercise }: { exercise: ExerciseListEntry | null }) {
  if (!exercise) {
    return (
      <div className="flex min-h-105 items-center justify-center rounded-xl bg-card ring-1 ring-foreground/10">
        <EmptyState
          icon={Dumbbell}
          title="Select Exercise"
          description="Click on an exercise to see statistics about it."
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-105 flex-col items-center justify-center gap-3 rounded-xl bg-card p-6 text-center ring-1 ring-foreground/10">
      {exercise.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={exercise.thumbnailUrl} alt="" className="size-14 rounded-full bg-muted object-cover" />
      ) : (
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <BarChart3 className="size-6 text-primary" />
        </div>
      )}
      <div>
        <h2 className="text-base font-semibold text-foreground">{exercise.name}</h2>
        <p className="text-sm text-muted-foreground">Statistics for this exercise are coming soon.</p>
      </div>
    </div>
  );
}
