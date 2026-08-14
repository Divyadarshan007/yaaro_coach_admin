import { Dumbbell } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

export function RoutineLibraryEmptyState() {
  return (
    <EmptyState
      className="min-h-105 justify-center rounded-xl bg-card ring-1 ring-foreground/10"
      icon={Dumbbell}
      title="No Routines"
      description="Create a routine to reuse it across any of your programs."
    />
  );
}
