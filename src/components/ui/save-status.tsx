"use client";

import { CircleCheck, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SaveStatus({
  isDirty,
  isSaving,
  error,
  onSave,
}: {
  isDirty: boolean;
  isSaving: boolean;
  error?: string | null;
  onSave: () => void;
}) {
  if (!isDirty && !isSaving) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <CircleCheck className="size-4" />
        All changes saved
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button size="lg" onClick={onSave} disabled={isSaving}>
        {isSaving && <Loader2 className="size-4 animate-spin" />}
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
