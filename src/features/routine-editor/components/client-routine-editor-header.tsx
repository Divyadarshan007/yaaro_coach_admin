"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SaveStatus } from "@/components/ui/save-status";
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";
import { useLeaveConfirmation } from "@/lib/use-leave-confirmation";
import { useUnsavedChangesWarning } from "@/lib/use-unsaved-changes-warning";

export function ClientRoutineEditorHeader({
  clientId,
  clientName,
  programTitle,
  routineId,
}: {
  clientId: string;
  clientName: string;
  programTitle: string;
  routineId: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const isDirty = useMyRoutinesStore((state) => !!state.dirty[routineId]);
  const isSaving = useMyRoutinesStore((state) => !!state.saving[routineId]);
  const saveRoutine = useMyRoutinesStore((state) => state.saveRoutine);
  const { isConfirmOpen, requestLeave, cancel, confirmLeave } = useLeaveConfirmation(isDirty);
  const backHref = `/clients/${clientId}/program`;

  useUnsavedChangesWarning(isDirty);

  function handleSave() {
    setError(null);
    saveRoutine(routineId).catch((err) => {
      setError(err instanceof Error ? err.message : "Failed to save routine");
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Link
        href={backHref}
        onClick={(event) => requestLeave(event, backHref)}
        className="w-fit text-sm text-muted-foreground hover:text-foreground"
      >
        {clientName}&apos;s Program / {programTitle}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            onClick={(event) => requestLeave(event, backHref)}
            aria-label="Back to Program"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Edit Routine</h1>
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
