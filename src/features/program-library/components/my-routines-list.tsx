"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/features/program-library/components/program-card";
import { RoutineDetailDialog } from "@/features/program-library/components/routine-detail-dialog";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";
import { useExerciseCatalogStore } from "@/lib/exercise-catalog-store";

export function MyRoutinesList() {
  const routines = useMyRoutinesStore((state) => state.routines);
  const removeRoutine = useMyRoutinesStore((state) => state.removeRoutine);
  const exerciseCatalogById = useExerciseCatalogStore((state) => state.byId);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const selectedRoutine = routines.find((routine) => routine.id === selectedRoutineId);

  return (
    <div className="flex flex-col gap-4">
      {routines.map((routine) => (
        <ProgramCard
          key={routine.id}
          title={routine.title}
          description={routine.notes}
          workouts={routine.exercises.map((exercise) => exerciseCatalogById.get(exercise.exerciseId)?.name ?? "Exercise")}
          onClick={() => setSelectedRoutineId(routine.id)}
          action={
            <Button variant="outline" size="lg" onClick={() => removeRoutine(routine.id)}>
              <X />
              Remove
            </Button>
          }
        />
      ))}

      <RoutineDetailDialog
        routine={selectedRoutine}
        open={selectedRoutineId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedRoutineId(null);
        }}
      />
    </div>
  );
}
