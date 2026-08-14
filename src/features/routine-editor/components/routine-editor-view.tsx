"use client";

import { Dumbbell } from "lucide-react";
import { useEffect, useRef } from "react";

import { ExercisePickerPanel } from "@/features/routine-editor/components/exercise-picker-panel";
import { RoutineDetailsForm } from "@/features/routine-editor/components/routine-details-form";
import { RoutineEditorHeader } from "@/features/routine-editor/components/routine-editor-header";
import { RoutineExerciseCard } from "@/features/routine-editor/components/routine-exercise-card";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";
import type { Routine } from "@/features/program-editor/types/program-editor";
import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

export function RoutineEditorView({
  programId,
  programTitle,
  initialRoutine,
  exerciseCatalog,
}: {
  programId: string;
  programTitle: string;
  initialRoutine: Routine | null;
  exerciseCatalog: ExerciseCatalogEntry[];
}) {
  const upsertRoutine = useMyRoutinesStore((state) => state.upsertRoutine);
  const addExercise = useMyRoutinesStore((state) => state.addExercise);
  const routine = useMyRoutinesStore((state) => (initialRoutine ? state.getRoutine(initialRoutine.id) : undefined));
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current || !initialRoutine) return;
    hasHydrated.current = true;
    // If this routine is already in the store (e.g. it was just created client-side and
    // we navigated here before its debounced backend save landed), skip re-hydrating —
    // doing so would overwrite that not-yet-persisted content with the stale server fetch.
    if (!useMyRoutinesStore.getState().getRoutine(initialRoutine.id)) {
      upsertRoutine(initialRoutine);
    }
  }, [initialRoutine, upsertRoutine]);

  const resolvedRoutine = routine ?? initialRoutine ?? undefined;

  if (!resolvedRoutine) {
    return (
      <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground">
        Routine not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:h-full lg:min-h-0">
      <RoutineEditorHeader programId={programId} programTitle={programTitle} />

      <div className="flex flex-col gap-6 lg:min-h-0 lg:flex-1 lg:flex-row lg:items-stretch">
        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
          <RoutineDetailsForm routine={resolvedRoutine} />

          {resolvedRoutine.exercises.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-xl bg-card p-6 text-center ring-1 ring-foreground/10">
              <Dumbbell className="size-6 text-muted-foreground" />
              <h3 className="text-base font-semibold text-foreground">No Exercises</h3>
              <p className="text-sm text-muted-foreground">
                So far, you haven&apos;t added any exercises to this routine.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {resolvedRoutine.exercises.map((exercise) => (
                <RoutineExerciseCard key={exercise.id} routineId={resolvedRoutine.id} exercise={exercise} />
              ))}
            </div>
          )}
        </div>

        <div className="w-full shrink-0 lg:h-full lg:w-96">
          <ExercisePickerPanel
            catalog={exerciseCatalog}
            onAddExercise={(exercise) =>
              addExercise(
                resolvedRoutine.id,
                exercise._id,
                (exercise.exerciseTypeId?.action?.length ? exercise.exerciseTypeId.action : ["KG", "REPS"]).map(
                  (key) => ({ key })
                )
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
