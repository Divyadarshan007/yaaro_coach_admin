"use client";

import { Check, Copy } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";

// Deep-clones a single routine (own or public, from inside a program's detail view)
// into a standalone entry in My Routines — separate from "Add to My Library", which
// clones the whole program. Reuses the same duplicateRoutine() the My Routines list
// itself uses (routine_ctrl.js getById + create — own-or-public, no Yaaro-link gate).
export function CopyRoutineButton({ routineId }: { routineId: string }) {
  const duplicateRoutine = useMyRoutinesStore((state) => state.duplicateRoutine);
  const [isPending, startTransition] = useTransition();
  const [justCopied, setJustCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCopy() {
    setError(null);
    startTransition(async () => {
      try {
        await duplicateRoutine(routineId);
        setJustCopied(true);
        setTimeout(() => setJustCopied(false), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to copy routine");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              size="icon-sm"
              variant="outline"
              disabled={isPending || justCopied}
              onClick={handleCopy}
              aria-label="Copy to My Routines"
            />
          }
        >
          {justCopied ? <Check className="text-primary" /> : <Copy />}
        </TooltipTrigger>
        <TooltipContent>{justCopied ? "Copied to My Routines" : "Copy to My Routines"}</TooltipContent>
      </Tooltip>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
