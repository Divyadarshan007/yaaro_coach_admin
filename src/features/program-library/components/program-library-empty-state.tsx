"use client";

import { ClipboardList, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { createBlankProgramAction } from "@/features/program-editor/actions";

export function ProgramLibraryEmptyState() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleCreateProgram() {
    startTransition(async () => {
      const id = await createBlankProgramAction();
      router.push(`/program/${id}`);
    });
  }

  return (
    <EmptyState
      className="min-h-105 justify-center rounded-xl bg-card ring-1 ring-foreground/10"
      icon={ClipboardList}
      title="No Workout Programs"
      description="Create your own workout program to get started."
      action={
        <Button size="lg" className="w-full max-w-xs" onClick={handleCreateProgram} disabled={isPending}>
          <Plus />
          Create Workout Program
        </Button>
      }
    />
  );
}
