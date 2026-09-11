"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SaveStatus } from "@/components/ui/save-status";
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import { useLeaveConfirmation } from "@/lib/use-leave-confirmation";
import { useUnsavedChangesWarning } from "@/lib/use-unsaved-changes-warning";

export function ClientProgramEditorHeader({
  clientId,
  clientName,
  programId,
}: {
  clientId: string;
  clientName: string;
  programId: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const isDirty = useMyProgramsStore((state) => !!state.dirty[programId]);
  const isSaving = useMyProgramsStore((state) => !!state.saving[programId]);
  const saveProgram = useMyProgramsStore((state) => state.saveProgram);
  const discardIfUnsaved = useMyProgramsStore((state) => state.discardIfUnsaved);
  const { isConfirmOpen, requestLeave, cancel, confirmLeave } = useLeaveConfirmation(isDirty, async () => {
    await discardIfUnsaved(programId);
  });
  const backHref = `/clients/${clientId}`;

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
        href={backHref}
        onClick={(event) => requestLeave(event, backHref)}
        className="w-fit text-sm text-muted-foreground hover:text-foreground"
      >
        {clientName}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            onClick={(event) => requestLeave(event, backHref)}
            aria-label="Back to Client"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Edit {clientName}&apos;s Program</h1>
        </div>

        <SaveStatus isDirty={isDirty} isSaving={isSaving} error={error} onSave={handleSave} />
      </div>

      <UnsavedChangesDialog
        open={isConfirmOpen}
        onOpenChange={(open) => !open && cancel()}
        onConfirm={confirmLeave}
      />
    </div>
  );
}
