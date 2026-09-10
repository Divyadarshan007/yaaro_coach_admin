"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  PROGRAM_DURATION_OPTIONS,
  PROGRAM_EQUIPMENT_OPTIONS,
  PROGRAM_GOAL_OPTIONS,
  PROGRAM_LEVEL_OPTIONS,
} from "@/features/program-editor/data/program-editor-data";
import { AddToMyLibraryButton } from "@/features/program-library/components/add-to-my-library-button";
import { RoutineExerciseList } from "@/features/program-library/components/routine-exercise-list";
import type { Program } from "@/features/program-editor/types/program-editor";

function labelFor(options: { value: string; label: string }[], value: string | null | undefined) {
  if (!value) return null;
  return options.find((option) => option.value === value)?.label ?? value;
}

export function ProgramDetailDialog({
  program,
  variant,
  open,
  onOpenChange,
  onEdit,
  onRemove,
}: {
  program: Program | undefined;
  variant: "library" | "explore";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Library variant only.
  onEdit?: (programId: string) => void;
  onRemove?: (programId: string) => void | Promise<void>;
}) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Clear the inline confirmation on every close so it never reappears mid-confirm
  // the next time a program is opened.
  function handleOpenChange(next: boolean) {
    if (!next) {
      setConfirmingRemove(false);
      setIsRemoving(false);
    }
    onOpenChange(next);
  }

  const routines = program?.routines ?? [];
  const metaChips = program
    ? [
        labelFor(PROGRAM_DURATION_OPTIONS, program.duration),
        labelFor(PROGRAM_LEVEL_OPTIONS, program.level),
        labelFor(PROGRAM_GOAL_OPTIONS, program.goal),
        labelFor(PROGRAM_EQUIPMENT_OPTIONS, program.equipment),
      ].filter((chip): chip is string => Boolean(chip))
    : [];

  async function handleRemove() {
    if (!program || !onRemove) return;
    setIsRemoving(true);
    try {
      await onRemove(program.id);
      setConfirmingRemove(false);
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        {program && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>{program.title}</DialogTitle>
                <Badge variant="outline" className="capitalize">
                  {program.visibility}
                </Badge>
              </div>
              {program.notes && <p className="text-sm text-muted-foreground">{program.notes}</p>}
              {metaChips.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {metaChips.map((chip) => (
                    <Badge key={chip} variant="secondary">
                      {chip}
                    </Badge>
                  ))}
                </div>
              )}
            </DialogHeader>

            <DialogBody>
              <p className="text-xs font-medium text-muted-foreground">
                {routines.length} {routines.length === 1 ? "routine" : "routines"}
              </p>
              {routines.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  This program doesn&apos;t have any routines yet.
                </p>
              ) : (
                routines.map((routine) => (
                  <div key={routine.id} className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{routine.title}</h3>
                    <RoutineExerciseList
                      exercises={routine.exercises}
                      emptyMessage="This routine doesn't have any exercises yet."
                    />
                  </div>
                ))
              )}
            </DialogBody>

            <DialogFooter className="flex-row justify-end">
              {variant === "explore" ? (
                <AddToMyLibraryButton programId={program.id} />
              ) : confirmingRemove ? (
                <div className="flex w-full flex-col gap-2">
                  <p className="text-sm text-foreground">Delete this program permanently?</p>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="lg"
                      disabled={isRemoving}
                      onClick={() => setConfirmingRemove(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" size="lg" disabled={isRemoving} onClick={handleRemove}>
                      <Trash2 />
                      {isRemoving ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setConfirmingRemove(true)}
                  >
                    <Trash2 />
                    Remove
                  </Button>
                  <Button size="lg" onClick={() => onEdit?.(program.id)}>
                    <Pencil />
                    Edit
                  </Button>
                </>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
