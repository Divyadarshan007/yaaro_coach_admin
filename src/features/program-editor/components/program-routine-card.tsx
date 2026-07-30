"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ProgramExerciseRow } from "@/features/program-editor/components/program-exercise-row";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import type { ProgramRoutine } from "@/features/program-editor/types/program-editor";

export function ProgramRoutineCard({ programId, routine }: { programId: string; routine: ProgramRoutine }) {
  const router = useRouter();
  const renameRoutine = useMyProgramsStore((state) => state.renameRoutine);
  const removeRoutine = useMyProgramsStore((state) => state.removeRoutine);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/program/${programId}/routine/${routine.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter") router.push(`/program/${programId}/routine/${routine.id}`);
      }}
      className="flex cursor-pointer flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
    >
      <div className="flex items-center justify-between gap-2" onClick={(event) => event.stopPropagation()}>
        <Input
          value={routine.name}
          onChange={(event) => renameRoutine(programId, routine.id, event.target.value)}
          className="h-8 max-w-72 border-transparent bg-transparent px-0 text-base font-semibold text-foreground focus-visible:border-ring focus-visible:bg-background focus-visible:px-2.5"
          aria-label="Routine name"
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" aria-label="Routine options" />}
          >
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive" onClick={() => removeRoutine(programId, routine.id)}>
              <Trash2 />
              Delete Routine
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
    </div>
  );
}
