"use client";

import { MoreVertical, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ProgramExerciseRow } from "@/features/program-editor/components/program-exercise-row";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";
import type { Routine } from "@/features/program-editor/types/program-editor";

export function ProgramRoutineCard({
  programId,
  routine,
  basePath = `/program/${programId}`,
}: {
  programId: string;
  routine: Routine;
  basePath?: string;
}) {
  const router = useRouter();
  const updateRoutineDetails = useMyRoutinesStore((state) => state.updateRoutineDetails);
  const removeRoutineFromProgram = useMyProgramsStore((state) => state.removeRoutineFromProgram);
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  function handleConfirmRemove() {
    removeRoutineFromProgram(programId, routine.id);
    setConfirmingRemove(false);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`${basePath}/routine/${routine.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter") router.push(`${basePath}/routine/${routine.id}`);
      }}
      className="flex cursor-pointer flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
    >
      <div className="flex items-center justify-between gap-2" onClick={(event) => event.stopPropagation()}>
        <Input
          value={routine.title}
          onChange={(event) => updateRoutineDetails(routine.id, { title: event.target.value })}
          className="h-8 max-w-72 border-transparent bg-transparent px-0 text-base font-semibold text-foreground focus-visible:border-ring focus-visible:bg-background focus-visible:px-2.5"
          aria-label="Routine title"
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label="Routine options" />}
          >
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setConfirmingRemove(true)}
            >
              <X />
              Remove from Program
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {routine.exercises.length > 0 && (
        <div className="flex flex-col gap-2">
          {routine.exercises.map((exercise) => (
            <ProgramExerciseRow key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}

      <Dialog open={confirmingRemove} onOpenChange={setConfirmingRemove}>
        <DialogContent className="max-w-md" onClick={(event) => event.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Remove {routine.title} from this program?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-muted-foreground">
              This removes the routine from this program. This action cannot be undone.
            </p>
          </DialogBody>
          <DialogFooter className="flex-row justify-end">
            <Button variant="outline" size="lg" onClick={() => setConfirmingRemove(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="lg" onClick={handleConfirmRemove}>
              Remove from Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
