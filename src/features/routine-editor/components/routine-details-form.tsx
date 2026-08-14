"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";
import type { Routine } from "@/features/program-editor/types/program-editor";

export function RoutineDetailsForm({ routine }: { routine: Routine }) {
  const updateRoutineDetails = useMyRoutinesStore((state) => state.updateRoutineDetails);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="routine-title" className="text-sm font-medium text-foreground">
          Routine Title
        </label>
        <Input
          id="routine-title"
          value={routine.title}
          onChange={(event) => updateRoutineDetails(routine.id, { title: event.target.value })}
          className="h-10"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="routine-notes" className="text-sm font-medium text-foreground">
          Routine Note
        </label>
        <Textarea
          id="routine-notes"
          value={routine.notes}
          onChange={(event) => updateRoutineDetails(routine.id, { notes: event.target.value })}
          placeholder="Add a brief description of the routine"
          className="min-h-24"
        />
      </div>
    </div>
  );
}
