"use client";

import { ClipboardList, LayoutGrid, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { createBlankProgramAction } from "@/features/program-editor/actions";

export function ProgramLibraryEmptyState({ onBrowseTemplates }: { onBrowseTemplates: () => void }) {
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
      description="Create a program yourself, or start with a pre-made Yaaro Coach template."
      action={
        <div className="flex w-full max-w-xs flex-col gap-2">
          <Button size="lg" className="w-full" onClick={handleCreateProgram} disabled={isPending}>
            <Plus />
            Create Workout Program
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={onBrowseTemplates}>
            <LayoutGrid />
            Browse Templates
          </Button>
        </div>
      }
    />
  );
}
