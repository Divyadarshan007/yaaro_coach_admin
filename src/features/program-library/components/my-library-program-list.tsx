"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProgramCard } from "@/features/program-library/components/program-card";
import { ProgramDetailDialog } from "@/features/program-library/components/program-detail-dialog";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";

export function MyLibraryProgramList() {
  const router = useRouter();
  const programs = useMyProgramsStore((state) => state.programs);
  const removeProgram = useMyProgramsStore((state) => state.removeProgram);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const selectedProgram = programs.find((program) => program.id === selectedProgramId);

  const [removeCandidateId, setRemoveCandidateId] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const removeCandidate = programs.find((program) => program.id === removeCandidateId);

  async function handleConfirmRemove() {
    if (!removeCandidateId) return;
    setIsRemoving(true);
    try {
      await removeProgram(removeCandidateId);
      setRemoveCandidateId(null);
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          title={program.title}
          description={program.notes}
          workouts={(program.routines ?? []).map((routine) => routine.title)}
          onClick={() => setSelectedProgramId(program.id)}
          action={
            <Button variant="outline" size="lg" onClick={() => setRemoveCandidateId(program.id)}>
              <X />
              Remove
            </Button>
          }
        />
      ))}

      <ProgramDetailDialog
        program={selectedProgram}
        variant="library"
        open={selectedProgramId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProgramId(null);
        }}
        onEdit={(programId) => router.push(`/program/${programId}`)}
        onRemove={async (programId) => {
          await removeProgram(programId);
          setSelectedProgramId(null);
        }}
      />

      <Dialog
        open={removeCandidateId !== null}
        onOpenChange={(next) => !isRemoving && !next && setRemoveCandidateId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove {removeCandidate?.title}?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-muted-foreground">
              This will permanently remove this program. This action cannot be undone.
            </p>
          </DialogBody>
          <DialogFooter className="flex-row justify-end">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setRemoveCandidateId(null)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button variant="destructive" size="lg" onClick={handleConfirmRemove} disabled={isRemoving}>
              {isRemoving ? "Removing..." : "Remove program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
