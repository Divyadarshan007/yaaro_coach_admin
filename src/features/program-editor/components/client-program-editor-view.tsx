"use client";

import { useEffect, useRef } from "react";

import { ClientProgramEditorHeader } from "@/features/program-editor/components/client-program-editor-header";
import { ProgramDetailsForm } from "@/features/program-editor/components/program-details-form";
import { ProgramRoutinesSection } from "@/features/program-editor/components/program-routines-section";
import { ProgramSummaryPanel } from "@/features/program-editor/components/program-summary-panel";
import { updateClientProgramAction } from "@/features/program-editor/actions";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import type { Program } from "@/features/program-editor/types/program-editor";
import type { MuscleCatalogEntry } from "@/lib/muscle-groups";

export function ClientProgramEditorView({
  clientId,
  clientName,
  initialProgram,
  muscleCatalog,
}: {
  clientId: string;
  clientName: string;
  initialProgram: Program | null;
  muscleCatalog: MuscleCatalogEntry[];
}) {
  const upsertProgram = useMyProgramsStore((state) => state.upsertProgram);
  const registerPersistAction = useMyProgramsStore((state) => state.registerPersistAction);
  const program = useMyProgramsStore((state) =>
    initialProgram ? state.getProgram(initialProgram.id) : undefined
  );
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current || !initialProgram) return;
    hasHydrated.current = true;
    registerPersistAction(initialProgram.id, (_id, patch) => updateClientProgramAction(clientId, patch));
    upsertProgram(initialProgram);
  }, [initialProgram, clientId, upsertProgram, registerPersistAction]);

  const resolvedProgram = program ?? initialProgram ?? undefined;

  if (!resolvedProgram) {
    return (
      <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground">
        Program not found.
      </div>
    );
  }

  const basePath = `/clients/${clientId}/program`;

  return (
    <div className="flex flex-col gap-6">
      <ClientProgramEditorHeader clientId={clientId} clientName={clientName} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <ProgramDetailsForm program={resolvedProgram} />
          <ProgramRoutinesSection program={resolvedProgram} basePath={basePath} />
        </div>

        <div className="w-full shrink-0 lg:w-80">
          <ProgramSummaryPanel program={resolvedProgram} muscleCatalog={muscleCatalog} />
        </div>
      </div>
    </div>
  );
}
