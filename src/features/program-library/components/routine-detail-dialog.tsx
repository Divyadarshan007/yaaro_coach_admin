"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { REST_TIMER_OPTIONS } from "@/features/routine-editor/data/routine-editor-data";
import { useExerciseCatalogStore } from "@/lib/exercise-catalog-store";
import type { Routine } from "@/features/program-editor/types/program-editor";

const DEFAULT_COLUMNS = [{ key: "KG" }, { key: "REPS" }];

function restTimerLabel(restSeconds: number) {
  return REST_TIMER_OPTIONS.find((option) => option.value === String(restSeconds))?.label ?? `${restSeconds}s`;
}

export function RoutineDetailDialog({
  routine,
  open,
  onOpenChange,
}: {
  routine: Routine | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const exerciseCatalogById = useExerciseCatalogStore((state) => state.byId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {routine && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>{routine.title}</DialogTitle>
                <Badge variant="outline" className="capitalize">
                  {routine.visibility}
                </Badge>
              </div>
              {routine.notes && <p className="text-sm text-muted-foreground">{routine.notes}</p>}
            </DialogHeader>

            <DialogBody>
              {routine.exercises.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  This routine doesn&apos;t have any exercises yet.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {routine.exercises.map((exercise) => {
                    const columns = exercise.actions.length > 0 ? exercise.actions : DEFAULT_COLUMNS;
                    return (
                      <div key={exercise.id} className="flex flex-col gap-2 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            {exerciseCatalogById.get(exercise.exerciseId)?.name ?? "Exercise"}
                          </h3>
                          <span className="text-xs text-muted-foreground">Rest: {restTimerLabel(exercise.restSeconds)}</span>
                        </div>

                        {exercise.notes && <p className="text-xs text-muted-foreground">{exercise.notes}</p>}

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 px-1 text-xs font-medium text-muted-foreground">
                            <span className="w-10">SET</span>
                            {columns.map((column) => (
                              <span key={column.key} className="flex-1">
                                {column.key}
                              </span>
                            ))}
                          </div>
                          {exercise.set.map((setEntry, index) => (
                            <div key={index} className="flex items-center gap-2 rounded-lg bg-muted/50 px-1 py-1.5">
                              <span className="flex w-10 shrink-0 items-center justify-center text-sm font-medium text-foreground">
                                {index + 1}
                              </span>
                              {columns.map((column) => (
                                <span key={column.key} className="flex-1 text-sm text-foreground">
                                  {setEntry.metrics.find((metric) => metric.type === column.key)?.value ?? "-"}
                                </span>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </DialogBody>

            <DialogFooter className="flex-row justify-end">
              <Button size="lg" nativeButton={false} render={<Link href={`/routines/${routine.id}`} />}>
                <Pencil />
                Edit Routine
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
