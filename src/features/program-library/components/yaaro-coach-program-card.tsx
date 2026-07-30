"use client";

import { Check, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/features/program-library/components/program-card";
import { useYaaroCoachLibraryStore } from "@/features/program-library/store/yaaro-coach-library-store";
import type { YaaroCoachProgram } from "@/features/program-library/types/yaaro-coach-library";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";

export function YaaroCoachProgramCard({ program }: { program: YaaroCoachProgram }) {
  const isAdded = useMyProgramsStore((state) => state.isTemplateAdded(program.id));
  const addFromTemplate = useMyProgramsStore((state) => state.addFromTemplate);
  const openProgramDetails = useYaaroCoachLibraryStore((state) => state.openProgramDetails);

  return (
    <ProgramCard
      title={program.title}
      description={program.description}
      workouts={program.routines.map((routine) => routine.name)}
      onClick={() => openProgramDetails(program.id)}
      action={
        <Button
          size="lg"
          variant={isAdded ? "outline" : "default"}
          disabled={isAdded}
          onClick={() => void addFromTemplate(program)}
        >
          {isAdded ? <Check /> : <Download />}
          {isAdded ? "Added to Library" : "Add to My Library"}
        </Button>
      }
    />
  );
}
