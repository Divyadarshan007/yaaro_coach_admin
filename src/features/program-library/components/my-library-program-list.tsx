"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/features/program-library/components/program-card";
import { ProgramDetailDialog } from "@/features/program-library/components/program-detail-dialog";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";

export function MyLibraryProgramList() {
  const router = useRouter();
  const programs = useMyProgramsStore((state) => state.programs);
  const removeProgram = useMyProgramsStore((state) => state.removeProgram);
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
          action={
            <Button variant="outline" size="lg" onClick={() => removeProgram(program.id)}>
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
    </div>
  );
}
