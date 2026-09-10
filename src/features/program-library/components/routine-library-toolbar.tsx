"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";

export function RoutineLibraryToolbar({ className }: { className?: string }) {
  const router = useRouter();
  const createRoutine = useMyRoutinesStore((state) => state.createRoutine);
  const [isPending, startTransition] = useTransition();

  function handleCreateRoutine() {
    startTransition(async () => {
      const id = await createRoutine();
      router.push(`/routines/${id}`);
    });
  }

  return (
    <Button size="lg" className={cn(className)} onClick={handleCreateRoutine} disabled={isPending}>
      <Plus />
      Add Routine
    </Button>
  );
}
