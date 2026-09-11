"use client";

import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SaveStatus } from "@/components/ui/save-status";
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog";
import { AssignProgramDialog } from "@/features/program-editor/components/assign-program-dialog";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import { useLeaveConfirmation } from "@/lib/use-leave-confirmation";
import { useUnsavedChangesWarning } from "@/lib/use-unsaved-changes-warning";
import type { ClientSummary } from "@/features/clients/types/client";

export function ProgramEditorHeader({ programId, clients }: { programId: string; clients: ClientSummary[] }) {
  const [assignOpen, setAssignOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDirty = useMyProgramsStore((state) => !!state.dirty[programId]);
  const isSaving = useMyProgramsStore((state) => !!state.saving[programId]);
  const saveProgram = useMyProgramsStore((state) => state.saveProgram);
  const { isConfirmOpen, requestLeave, cancel, confirmLeave } = useLeaveConfirmation(isDirty);

  useUnsavedChangesWarning(isDirty);

  function handleSave() {
    setError(null);
    saveProgram(programId).catch((err) => {
      setError(err instanceof Error ? err.message : "Failed to save program");
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/program-library"
        onClick={(event) => requestLeave(event, "/program-library")}
        className="w-fit text-sm text-muted-foreground hover:text-foreground"
      >
        My Programs
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/program-library"
            onClick={(event) => requestLeave(event, "/program-library")}
            aria-label="Back to Program Library"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Edit Program Template</h1>
        </div>

        <div className="flex items-center gap-4">
          <SaveStatus isDirty={isDirty} isSaving={isSaving} error={error} onSave={handleSave} />
          <Button variant="outline" size="lg" onClick={() => setAssignOpen(true)}>
            <UserPlus />
            Assign Program
          </Button>
        </div>
      </div>

      <AssignProgramDialog programId={programId} clients={clients} open={assignOpen} onOpenChange={setAssignOpen} />
      <UnsavedChangesDialog
        open={isConfirmOpen}
        onOpenChange={(open) => !open && cancel()}
        onConfirm={confirmLeave}
      />
    </div>
  );
}
