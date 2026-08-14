"use client";

import { useEffect, useRef } from "react";

import { ProgramDetailsForm } from "@/features/program-editor/components/program-details-form";
import { ProgramEditorHeader } from "@/features/program-editor/components/program-editor-header";
import { ProgramRoutinesSection } from "@/features/program-editor/components/program-routines-section";
import { ProgramSummaryPanel } from "@/features/program-editor/components/program-summary-panel";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";
import type { Program, Routine } from "@/features/program-editor/types/program-editor";
import type { MuscleCatalogEntry } from "@/lib/muscle-groups";
import type { ClientSummary } from "@/features/clients/types/client";

export function ProgramEditorView({
  initialProgram,
  muscleCatalog,
  clients,
  initialRoutines,
}: {
  initialProgram: Program | null;
  muscleCatalog: MuscleCatalogEntry[];
  clients: ClientSummary[];
  initialRoutines: Routine[];
}) {
  const upsertProgram = useMyProgramsStore((state) => state.upsertProgram);
  const program = useMyProgramsStore((state) =>
    initialProgram ? state.getProgram(initialProgram.id) : undefined
  );
  const hydrateRoutines = useMyRoutinesStore((state) => state.hydrateRoutines);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current || !initialProgram) return;
    hasHydrated.current = true;
    upsertProgram(initialProgram);
    hydrateRoutines(initialRoutines);
  }, [initialProgram, upsertProgram, initialRoutines, hydrateRoutines]);

  const resolvedProgram = program ?? initialProgram ?? undefined;

  if (!resolvedProgram) {
    return (
      <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground">
        Program not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProgramEditorHeader programId={resolvedProgram.id} clients={clients} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <ProgramDetailsForm program={resolvedProgram} />
          <ProgramRoutinesSection program={resolvedProgram} />
        </div>

        <div className="w-full shrink-0 lg:w-80">
          <ProgramSummaryPanel program={resolvedProgram} muscleCatalog={muscleCatalog} />
        </div>
      </div>
    </div>
  );
}
