"use client";

import { Lock, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";
import { useIsLinkedToYaaro } from "@/features/program-library/lib/yaaro-link-context";
import { YaaroLinkRequiredDialog } from "@/features/program-library/components/yaaro-link-required-dialog";

export function RoutineLibraryToolbar() {
  const router = useRouter();
  const createRoutine = useMyRoutinesStore((state) => state.createRoutine);
  const isLinkedToYaaro = useIsLinkedToYaaro();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [showLinkRequired, setShowLinkRequired] = useState(false);
  const [linkRequiredMessage, setLinkRequiredMessage] = useState<string | undefined>(undefined);

  function handleCreateRoutine() {
    // Not linked yet — don't even call the (gated) backend, just explain why the
    // button is locked. See YaaroLinkProvider / coach/controllers/routine_ctrl.js.
    if (!isLinkedToYaaro) {
      setLinkRequiredMessage(undefined);
      setShowLinkRequired(true);
      return;
    }

    startTransition(async () => {
      try {
        const id = await createRoutine();
        router.push(`/routines/${id}`);
      } catch (err) {
        // Fallback for a race (e.g. link status changed after this page loaded) —
        // still shown as the same popup, not an inline message or a crashed page.
        setLinkRequiredMessage(err instanceof Error ? err.message : "Failed to create routine");
        setShowLinkRequired(true);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative sm:max-w-sm sm:flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search routines"
          className="h-9 w-full pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="lg"
          className={!isLinkedToYaaro ? "opacity-50 blur-[0.5px] grayscale hover:opacity-50" : undefined}
          onClick={handleCreateRoutine}
          disabled={isPending}
          aria-label={isLinkedToYaaro ? "Add Routine" : "Add Routine (locked — not linked to Yaaro)"}
        >
          {isLinkedToYaaro ? <Plus /> : <Lock />}
          Add Routine
        </Button>
      </div>
      <YaaroLinkRequiredDialog open={showLinkRequired} onOpenChange={setShowLinkRequired} message={linkRequiredMessage} />
    </div>
  );
}
