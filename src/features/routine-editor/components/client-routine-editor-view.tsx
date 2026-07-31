"use client";

import { Dumbbell } from "lucide-react";
import { useEffect, useRef } from "react";

import { ExercisePickerPanel } from "@/features/routine-editor/components/exercise-picker-panel";
import { RoutineDetailsForm } from "@/features/routine-editor/components/routine-details-form";
import { ClientRoutineEditorHeader } from "@/features/routine-editor/components/client-routine-editor-header";
import { RoutineExerciseCard } from "@/features/routine-editor/components/routine-exercise-card";
import { updateClientProgramAction } from "@/features/program-editor/actions";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import type { Program } from "@/features/program-editor/types/program-editor";
import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

export function ClientRoutineEditorView({
  clientId,
  clientName,
  routineId,
  initialProgram,
  exerciseCatalog,
}: {
  clientId: string;
  clientName: string;
  routineId: string;
  initialProgram: Program | null;
  exerciseCatalog: ExerciseCatalogEntry[];
}) {
  const upsertProgram = useMyProgramsStore((state) => state.upsertProgram);
  const registerPersistAction = useMyProgramsStore((state) => state.registerPersistAction);
  const addExercise = useMyProgramsStore((state) => state.addExercise);
  const program = useMyProgramsStore((state) => (initialProgram ? state.getProgram(initialProgram.id) : undefined));
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current || !initialProgram) return;
    hasHydrated.current = true;
    registerPersistAction(initialProgram.id, (_id, patch) => updateClientProgramAction(clientId, patch));
    // Same not-yet-persisted-routine guard as RoutineEditorView (see that file for why).
    if (!useMyProgramsStore.getState().getProgram(initialProgram.id)) {
      upsertProgram(initialProgram);
    }
  }, [initialProgram, clientId, upsertProgram, registerPersistAction]);

  const resolvedProgram = program ?? initialProgram ?? undefined;
  const routine = resolvedProgram?.routines.find((candidate) => candidate.id === routineId);

  if (!resolvedProgram || !routine) {
    return (
      <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground">
        Routine not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:h-full lg:min-h-0">
      <ClientRoutineEditorHeader clientId={clientId} clientName={clientName} programTitle={resolvedProgram.title} />

      <div className="flex flex-col gap-6 lg:min-h-0 lg:flex-1 lg:flex-row lg:items-stretch">
        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
          <RoutineDetailsForm programId={resolvedProgram.id} routine={routine} />

          {routine.exercises.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-xl bg-card p-6 text-center ring-1 ring-foreground/10">
              <Dumbbell className="size-6 text-muted-foreground" />
              <h3 className="text-base font-semibold text-foreground">No Exercises</h3>
              <p className="text-sm text-muted-foreground">
                So far, you haven&apos;t added any exercises to this routine.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {routine.exercises.map((exercise) => (
                <RoutineExerciseCard
                  key={exercise.id}
                  programId={resolvedProgram.id}
                  routineId={routine.id}
                  exercise={exercise}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-full shrink-0 lg:h-full lg:w-96">
          <ExercisePickerPanel
            catalog={exerciseCatalog}
            onAddExercise={(exercise) =>
              addExercise(resolvedProgram.id, routine.id, {
                name: exercise.name,
                muscleId: exercise.muscleId?._id ?? null,
                actions: exercise.exerciseTypeId?.action?.length ? exercise.exerciseTypeId.action : ["KG", "REPS"],
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
