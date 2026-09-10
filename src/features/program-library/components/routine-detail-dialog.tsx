"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoutineExerciseList } from "@/features/program-library/components/routine-exercise-list";
import type { Routine } from "@/features/program-editor/types/program-editor";

export function RoutineDetailDialog({
  routine,
  open,
  onOpenChange,
}: {
  routine: Routine | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
              <RoutineExerciseList exercises={routine.exercises} />
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
