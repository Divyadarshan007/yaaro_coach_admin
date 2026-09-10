"use client";

import { Check, Download } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";

export function AddToMyLibraryButton({ programId }: { programId: string }) {
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
