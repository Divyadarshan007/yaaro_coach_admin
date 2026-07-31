"use client";

import { Dumbbell, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AddRoutineDialog } from "@/features/program-editor/components/add-routine-dialog";
import { ProgramRoutineCard } from "@/features/program-editor/components/program-routine-card";
import type { Program } from "@/features/program-editor/types/program-editor";

export function ProgramRoutinesSection({
  program,
  basePath = `/program/${program.id}`,
}: {
  program: Program;
  basePath?: string;
}) {
  const [addRoutineOpen, setAddRoutineOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">Routines</h2>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
            {program.routines.length}
          </span>
        </div>
        <Button size="lg" onClick={() => setAddRoutineOpen(true)}>
          <Plus />
          Add Routine
        </Button>
      </div>

      {program.routines.length === 0 ? (
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
        <div className="flex flex-col gap-4">
          {program.routines.map((routine) => (
            <ProgramRoutineCard key={routine.id} programId={program.id} routine={routine} basePath={basePath} />
          ))}
        </div>
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
