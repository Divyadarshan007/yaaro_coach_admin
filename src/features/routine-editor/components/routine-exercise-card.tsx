"use client";

import { MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REST_TIMER_OPTIONS } from "@/features/routine-editor/data/routine-editor-data";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";
import type { RoutineExercise } from "@/features/program-editor/types/program-editor";
import { useExerciseCatalogEntry } from "@/lib/exercise-catalog-store";

// Mirrors the mobile app's action-driven set table: an exercise's `actions` (from the
// catalog's exerciseType.action, e.g. ["REPS"] for bodyweight-only, ["+KG", "REPS"] for
// weighted bodyweight) decide which columns render — each action's key doubles as the
// metric `type` stored on that column's values, so no fixed lbs/reps pair is hardcoded.
const DEFAULT_COLUMNS = [{ key: "KG" }, { key: "REPS" }];

export function RoutineExerciseCard({ routineId, exercise }: { routineId: string; exercise: RoutineExercise }) {
  const updateExercise = useMyRoutinesStore((state) => state.updateExercise);
  const removeExercise = useMyRoutinesStore((state) => state.removeExercise);
  const addExerciseSet = useMyRoutinesStore((state) => state.addExerciseSet);
  const removeExerciseSet = useMyRoutinesStore((state) => state.removeExerciseSet);
  const updateExerciseSetMetric = useMyRoutinesStore((state) => state.updateExerciseSetMetric);
  const catalogEntry = useExerciseCatalogEntry(exercise.exerciseId);

  const columns = exercise.actions.length > 0 ? exercise.actions : DEFAULT_COLUMNS;

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">{catalogEntry?.name ?? "Exercise"}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Exercise options" />}>
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive" onClick={() => removeExercise(routineId, exercise.id)}>
              <Trash2 />
              Remove Exercise
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-muted-foreground">Note</label>
        <Input
          value={exercise.notes}
          onChange={(event) => updateExercise(routineId, exercise.id, { notes: event.target.value })}
          placeholder="Add pinned note"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-muted-foreground">Rest Timer:</label>
        <Select
          items={REST_TIMER_OPTIONS}
          value={String(exercise.restSeconds)}
          onValueChange={(value) => updateExercise(routineId, exercise.id, { restSeconds: Number(value) })}
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
            <span key={column.key} className="flex-1">
              {column.key}
            </span>
          ))}
          <span className="w-7" />
        </div>

        {exercise.set.map((setEntry, index) => (
          <div key={index} className="flex items-center gap-2 rounded-lg bg-muted/50 px-1 py-1">
            <span className="flex w-10 shrink-0 items-center justify-center text-sm font-medium text-foreground">
              {index + 1}
            </span>
            {columns.map((column) => {
              const metricValue = setEntry.metrics.find((metric) => metric.type === column.key)?.value ?? null;
              return (
                <Input
                  key={column.key}
                  type="number"
                  value={metricValue ?? ""}
                  onChange={(event) =>
                    updateExerciseSetMetric(
                      routineId,
                      exercise.id,
                      index,
                      column.key,
                      event.target.value === "" ? null : Number(event.target.value)
                    )
                  }
                  className="h-8 flex-1 bg-background"
                />
              );
            })}
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground"
              aria-label="Remove set"
              disabled={exercise.set.length <= 1}
              onClick={() => removeExerciseSet(routineId, exercise.id, index)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={() => addExerciseSet(routineId, exercise.id)}>
        + Add set
      </Button>
    </div>
  );
}
