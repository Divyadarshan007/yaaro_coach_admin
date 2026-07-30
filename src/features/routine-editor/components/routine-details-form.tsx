"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import type { ProgramRoutine } from "@/features/program-editor/types/program-editor";

export function RoutineDetailsForm({ programId, routine }: { programId: string; routine: ProgramRoutine }) {
  const renameRoutine = useMyProgramsStore((state) => state.renameRoutine);
  const updateRoutineNote = useMyProgramsStore((state) => state.updateRoutineNote);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="routine-title" className="text-sm font-medium text-foreground">
          Routine Title
        </label>
        <Input
          id="routine-title"
          value={routine.name}
          onChange={(event) => renameRoutine(programId, routine.id, event.target.value)}
          className="h-10"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="routine-note" className="text-sm font-medium text-foreground">
          Routine Note
        </label>
        <Textarea
          id="routine-note"
          value={routine.note}
          onChange={(event) => updateRoutineNote(programId, routine.id, event.target.value)}
          placeholder="Add a brief description of the routine"
          className="min-h-24"
        />
      </div>
    </div>
  );
}
