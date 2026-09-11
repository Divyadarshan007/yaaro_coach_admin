"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  const [removeCandidateId, setRemoveCandidateId] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const removeCandidate = routines.find((routine) => routine.id === removeCandidateId);

  async function handleConfirmRemove() {
    if (!removeCandidateId) return;
    setIsRemoving(true);
    try {
      await removeRoutine(removeCandidateId);
      setRemoveCandidateId(null);
    } finally {
      setIsRemoving(false);
    }
  }

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
            <Button variant="outline" size="lg" onClick={() => setRemoveCandidateId(routine.id)}>
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

      <Dialog
        open={removeCandidateId !== null}
        onOpenChange={(next) => !isRemoving && !next && setRemoveCandidateId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove {removeCandidate?.title}?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-muted-foreground">
              This will permanently remove this routine. This action cannot be undone.
            </p>
          </DialogBody>
          <DialogFooter className="flex-row justify-end">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setRemoveCandidateId(null)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button variant="destructive" size="lg" onClick={handleConfirmRemove} disabled={isRemoving}>
              {isRemoving ? "Removing..." : "Remove routine"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
