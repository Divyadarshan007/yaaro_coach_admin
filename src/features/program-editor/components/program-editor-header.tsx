"use client";

import { ArrowLeft, CircleCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AssignProgramDialog } from "@/features/program-editor/components/assign-program-dialog";
import type { ClientSummary } from "@/features/clients/types/client";

export function ProgramEditorHeader({ programId, clients }: { programId: string; clients: ClientSummary[] }) {
  const [assignOpen, setAssignOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Link href="/program-library" className="w-fit text-sm text-muted-foreground hover:text-foreground">
        My Programs
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/program-library"
            aria-label="Back to Program Library"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Edit Program Template</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CircleCheck className="size-4" />
            All changes saved
          </div>
          <Button variant="outline" size="lg" onClick={() => setAssignOpen(true)}>
            <UserPlus />
            Assign Program
          </Button>
        </div>
      </div>

      <AssignProgramDialog programId={programId} clients={clients} open={assignOpen} onOpenChange={setAssignOpen} />
    </div>
  );
}
