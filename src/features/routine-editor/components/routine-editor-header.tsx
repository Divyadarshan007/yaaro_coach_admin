"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SaveStatus } from "@/components/ui/save-status";
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";
import { useLeaveConfirmation } from "@/lib/use-leave-confirmation";
import { useUnsavedChangesWarning } from "@/lib/use-unsaved-changes-warning";

export function RoutineEditorHeader({
  programId,
  programTitle,
  routineId,
}: {
  programId?: string;
  programTitle: string;
  routineId: string;
}) {
  const backHref = programId ? `/program/${programId}` : "/program-library";
  const breadcrumb = programId ? `My Programs / ${programTitle}` : "Program Library / My Routines";

  const [error, setError] = useState<string | null>(null);
  const isDirty = useMyRoutinesStore((state) => !!state.dirty[routineId]);
  const isSaving = useMyRoutinesStore((state) => !!state.saving[routineId]);
  const saveRoutine = useMyRoutinesStore((state) => state.saveRoutine);
  const discardIfUnsaved = useMyRoutinesStore((state) => state.discardIfUnsaved);
  const removeRoutineFromProgram = useMyProgramsStore((state) => state.removeRoutineFromProgram);
  const { isConfirmOpen, requestLeave, cancel, confirmLeave } = useLeaveConfirmation(isDirty, async () => {
    const wasDiscarded = await discardIfUnsaved(routineId);
    // A never-saved routine that just got deleted might still be sitting in the
    // program's own local routines list (added there when it was created) — drop it
    // there too so a "ghost" card doesn't linger on the program page.
    if (wasDiscarded && programId) removeRoutineFromProgram(programId, routineId);
  });

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
        {breadcrumb}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            onClick={(event) => requestLeave(event, backHref)}
            aria-label="Back"
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
