"use client";

import { MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REST_TIMER_OPTIONS } from "@/features/routine-editor/data/routine-editor-data";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import type { ProgramExercise, ProgramExerciseSet } from "@/features/program-editor/types/program-editor";

type SetColumn = { action: string; field: keyof ProgramExerciseSet; label: string };

const DEFAULT_COLUMNS: SetColumn[] = [
  { action: "KG", field: "lbs", label: "KG" },
  { action: "REPS", field: "reps", label: "REPS" },
];

// Mirrors the mobile app's action-driven set table: an exercise's `actions` (from the
// catalog's exerciseType.action, e.g. ["REPS"] for bodyweight-only, ["+KG", "REPS"] for
// weighted bodyweight) decide which columns render, instead of a fixed KG+REPS pair.
// Duration/distance actions (TIME, KM) aren't supported by this set shape yet, so they
// fall back to the legacy KG+REPS columns rather than rendering no inputs at all.
function getSetColumns(actions: string[]): SetColumn[] {
  const columns = actions.flatMap((action): SetColumn[] => {
    if (action === "REPS") return [{ action, field: "reps", label: "REPS" }];
    if (action === "KG" || action === "+KG" || action === "-KG") return [{ action, field: "lbs", label: action }];
    return [];
  });
  return columns.length > 0 ? columns : DEFAULT_COLUMNS;
}

export function RoutineExerciseCard({
  programId,
  routineId,
  exercise,
}: {
  programId: string;
  routineId: string;
  exercise: ProgramExercise;
}) {
  const updateExercise = useMyProgramsStore((state) => state.updateExercise);
  const removeExercise = useMyProgramsStore((state) => state.removeExercise);
  const addExerciseSet = useMyProgramsStore((state) => state.addExerciseSet);
  const updateExerciseSet = useMyProgramsStore((state) => state.updateExerciseSet);
  const removeExerciseSet = useMyProgramsStore((state) => state.removeExerciseSet);

  const columns = getSetColumns(exercise.actions);

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">{exercise.name}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Exercise options" />}>
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              variant="destructive"
              onClick={() => removeExercise(programId, routineId, exercise.id)}
            >
              <Trash2 />
              Remove Exercise
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-muted-foreground">Note</label>
        <Input
          value={exercise.note}
          onChange={(event) => updateExercise(programId, routineId, exercise.id, { note: event.target.value })}
          placeholder="Add pinned note"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-muted-foreground">Rest Timer:</label>
        <Select
          items={REST_TIMER_OPTIONS}
          value={exercise.rest}
          onValueChange={(value) => updateExercise(programId, routineId, exercise.id, { rest: value as string })}
        >
          <SelectTrigger className="max-w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REST_TIMER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 px-1 text-xs font-medium text-muted-foreground">
          <span className="w-10">SET</span>
          {columns.map((column) => (
            <span key={column.action} className="flex-1">
              {column.label}
            </span>
          ))}
          <span className="w-7" />
        </div>

        {exercise.sets.map((set, index) => (
          <div key={index} className="flex items-center gap-2 rounded-lg bg-muted/50 px-1 py-1">
            <span className="flex w-10 shrink-0 items-center justify-center text-sm font-medium text-foreground">
              {index + 1}
            </span>
            {columns.map((column) => (
              <Input
                key={column.action}
                type="number"
                value={set[column.field] ?? ""}
                onChange={(event) =>
                  updateExerciseSet(programId, routineId, exercise.id, index, {
                    [column.field]: event.target.value === "" ? null : Number(event.target.value),
                  })
                }
                className="h-8 flex-1 bg-background"
              />
            ))}
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground"
              aria-label="Remove set"
              disabled={exercise.sets.length <= 1}
              onClick={() => removeExerciseSet(programId, routineId, exercise.id, index)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={() => addExerciseSet(programId, routineId, exercise.id)}>
        + Add set
      </Button>
    </div>
  );
}
