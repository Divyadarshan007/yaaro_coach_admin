"use client";

import { Check, Download } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/features/program-library/components/program-card";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import type { Program } from "@/features/program-editor/types/program-editor";

function AddToMyLibraryButton({ programId }: { programId: string }) {
  const duplicateProgram = useMyProgramsStore((state) => state.duplicateProgram);
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    startTransition(async () => {
      await duplicateProgram(programId);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    });
  }

  return (
    <Button size="lg" variant={justAdded ? "outline" : "default"} disabled={isPending || justAdded} onClick={handleAdd}>
      {justAdded ? <Check /> : <Download />}
      {justAdded ? "Added to Library" : "Add to My Library"}
    </Button>
  );
}

// Explore shows every OTHER coach's public program — this is also where the seeded Yaaro
// Coach Library programs live now (they're just public programs owned by a fixed real
// account, not "mine"), so there's no separate template concept anymore.
export function ExploreProgramList({ programs }: { programs: Program[] }) {
  return (
    <div className="flex flex-col gap-4">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          title={program.title}
          description={program.notes}
          workouts={(program.routines ?? []).map((routine) => routine.title)}
          action={<AddToMyLibraryButton programId={program.id} />}
        />
      ))}
    </div>
  );
}
