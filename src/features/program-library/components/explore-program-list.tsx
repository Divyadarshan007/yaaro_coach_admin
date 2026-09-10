"use client";

import { useState } from "react";

import { AddToMyLibraryButton } from "@/features/program-library/components/add-to-my-library-button";
import { ProgramCard } from "@/features/program-library/components/program-card";
import { ProgramDetailDialog } from "@/features/program-library/components/program-detail-dialog";
import type { Program } from "@/features/program-editor/types/program-editor";

// Explore shows every OTHER coach's public program — this is also where the seeded Yaaro
// Coach Library programs live now (they're just public programs owned by a fixed real
// account, not "mine"), so there's no separate template concept anymore.
export function ExploreProgramList({ programs }: { programs: Program[] }) {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const selectedProgram = programs.find((program) => program.id === selectedProgramId);

  return (
    <div className="flex flex-col gap-4">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          title={program.title}
          description={program.notes}
          workouts={(program.routines ?? []).map((routine) => routine.title)}
          onClick={() => setSelectedProgramId(program.id)}
          action={<AddToMyLibraryButton programId={program.id} />}
        />
      ))}

      <ProgramDetailDialog
        program={selectedProgram}
        variant="explore"
        open={selectedProgramId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProgramId(null);
        }}
      />
    </div>
  );
}
