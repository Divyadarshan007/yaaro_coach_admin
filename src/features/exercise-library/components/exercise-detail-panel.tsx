import { Dumbbell } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

export function ExerciseDetailPanel({ exercise }: { exercise: ExerciseCatalogEntry | null }) {
  if (!exercise) {
    return (
      <div className="flex min-h-105 flex-col items-center justify-center gap-3 rounded-xl bg-card p-6 text-center ring-1 ring-foreground/10">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <Dumbbell className="size-6 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">Select Exercise</h2>
          <p className="text-sm text-muted-foreground">Start by selecting an exercise from the library</p>
        </div>
      </div>
    );
  }

  const equipmentName = exercise.equipmentId?.name ?? "Other";
  const muscleGroupName = exercise.muscleId?.muscleGroupId?.name ?? exercise.muscleId?.name ?? "Unspecified";
  const exerciseTypeName = exercise.exerciseTypeId?.name ?? "—";
  const hasVideo = Boolean(exercise.url) && exercise.mediaType === "video";

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-foreground">{exercise.name}</h1>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex gap-1">
              <dt className="font-medium text-foreground">Equipment:</dt>
              <dd className="text-muted-foreground">{equipmentName}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="font-medium text-foreground">Primary Muscle Group:</dt>
              <dd className="text-muted-foreground">{muscleGroupName}</dd>
            </div>
            <div className="flex gap-1">
              <dt className="font-medium text-foreground">Exercise Type:</dt>
              <dd className="text-muted-foreground">{exerciseTypeName}</dd>
            </div>
          </dl>

          {hasVideo ? (
            <video
              key={exercise._id}
              src={exercise.url}
              poster={exercise.thumbnailUrl || undefined}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="h-full max-h-64 w-full rounded-lg bg-muted object-contain"
            />
          ) : (
            exercise.thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={exercise.thumbnailUrl}
                alt={exercise.name}
                className="h-full max-h-64 w-full rounded-lg object-contain"
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
