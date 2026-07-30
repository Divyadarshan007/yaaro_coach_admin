"use client";

import { Check, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useYaaroCoachLibraryStore } from "@/features/program-library/store/yaaro-coach-library-store";
import type { YaaroCoachProgram } from "@/features/program-library/types/yaaro-coach-library";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";

export function YaaroCoachProgramDetailsDialog({ templates }: { templates: YaaroCoachProgram[] }) {
  const activeProgramId = useYaaroCoachLibraryStore((state) => state.activeProgramId);
  const closeProgramDetails = useYaaroCoachLibraryStore((state) => state.closeProgramDetails);
  const isAdded = useMyProgramsStore(
    (state) => activeProgramId !== null && state.isTemplateAdded(activeProgramId)
  );
  const addFromTemplate = useMyProgramsStore((state) => state.addFromTemplate);

  const program = templates.find((item) => item.id === activeProgramId) ?? null;

  return (
    <Dialog open={activeProgramId !== null} onOpenChange={(open) => !open && closeProgramDetails()}>
      <DialogContent>
        {program && (
          <>
            <DialogHeader>
              <DialogTitle>{program.title}</DialogTitle>
            </DialogHeader>

            <DialogBody>
              <p className="text-sm text-muted-foreground">{program.description}</p>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Routines</span>
                <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {program.routines.length}
                </span>
              </div>

              {program.routines.map((routine) => (
                <div key={routine.name} className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-medium text-foreground">{routine.name}</h3>
                  {routine.exercises.map((exercise, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {exercise.sets} x {exercise.name}
                      {exercise.rest ? `, Rest: ${exercise.rest}` : ""}
                    </p>
                  ))}
                </div>
              ))}
            </DialogBody>

            <DialogFooter className="flex-row justify-end">
              <Button
                size="lg"
                variant={isAdded ? "outline" : "default"}
                disabled={isAdded}
                onClick={() => void addFromTemplate(program)}
              >
                {isAdded ? <Check /> : <Download />}
                {isAdded ? "Added to Library" : "Add to My Library"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
