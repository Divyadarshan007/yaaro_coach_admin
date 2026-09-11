"use client";

import { Dumbbell, Plus } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AddRoutineDialog } from "@/features/program-editor/components/add-routine-dialog";
import { ProgramRoutineCard } from "@/features/program-editor/components/program-routine-card";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import type { Program, Routine } from "@/features/program-editor/types/program-editor";

// Drag is triggered only from the card's own grip handle (dragListener={false} +
// dragControls), not from anywhere else on the card — the card also has a click-to-
// navigate area, an inline-editable title, and a menu, so free-dragging the whole
// surface would fight with those.
function DraggableRoutineCard({
  programId,
  routine,
  basePath,
}: {
  programId: string;
  routine: Routine;
  basePath: string;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item value={routine} dragListener={false} dragControls={dragControls} className="list-none">
      <ProgramRoutineCard programId={programId} routine={routine} basePath={basePath} dragControls={dragControls} />
    </Reorder.Item>
  );
}

export function ProgramRoutinesSection({
  program,
  basePath = `/program/${program.id}`,
}: {
  program: Program;
  basePath?: string;
}) {
  const [addRoutineOpen, setAddRoutineOpen] = useState(false);
  const reorderProgramRoutines = useMyProgramsStore((state) => state.reorderProgramRoutines);
  const programRoutines = program.routines ?? [];

  function handleReorder(next: Routine[]) {
    reorderProgramRoutines(program.id, next.map((routine) => routine.id));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">Routines</h2>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
            {program.routineIds.length}
          </span>
        </div>
        <Button size="lg" onClick={() => setAddRoutineOpen(true)}>
          <Plus />
          Add Routine
        </Button>
      </div>

      {programRoutines.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-xl bg-card p-6 text-center ring-1 ring-foreground/10">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Dumbbell className="size-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-foreground">No Routines</h3>
            <p className="text-sm text-muted-foreground">Create the first routine in this program</p>
          </div>
          <Button size="lg" onClick={() => setAddRoutineOpen(true)}>
            <Plus />
            Add Routine
          </Button>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={programRoutines}
          onReorder={handleReorder}
          className="flex flex-col gap-4"
        >
          {programRoutines.map((routine) => (
            <DraggableRoutineCard key={routine.id} programId={program.id} routine={routine} basePath={basePath} />
          ))}
        </Reorder.Group>
      )}

      <AddRoutineDialog
        programId={program.id}
        basePath={basePath}
        open={addRoutineOpen}
        onOpenChange={setAddRoutineOpen}
      />
    </div>
  );
}
