"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/features/program-library/components/program-card";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";

export function MyLibraryProgramList() {
  const router = useRouter();
  const programs = useMyProgramsStore((state) => state.programs);
  const removeProgram = useMyProgramsStore((state) => state.removeProgram);

  return (
    <div className="flex flex-col gap-4">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          title={program.title}
          description={program.note}
          workouts={program.routines.map((routine) => routine.name)}
          onClick={() => router.push(`/program/${program.id}`)}
          action={
            <Button variant="outline" size="lg" onClick={() => removeProgram(program.id)}>
              <X />
              Remove
            </Button>
          }
        />
      ))}
    </div>
  );
}
