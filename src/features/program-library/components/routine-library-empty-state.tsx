"use client";

import { Dumbbell, Lock, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";
import { useIsLinkedToYaaro } from "@/features/program-library/lib/yaaro-link-context";
import { YaaroLinkRequiredDialog } from "@/features/program-library/components/yaaro-link-required-dialog";
import { useSubscriptionGateStore } from "@/lib/subscription-gate-store";
import { SUBSCRIPTION_REQUIRED_PREFIX } from "@/lib/subscription-required";

export function RoutineLibraryEmptyState() {
  const router = useRouter();
  const createRoutine = useMyRoutinesStore((state) => state.createRoutine);
  const isLinkedToYaaro = useIsLinkedToYaaro();
  const [isPending, startTransition] = useTransition();
  const [showLinkRequired, setShowLinkRequired] = useState(false);
  const [linkRequiredMessage, setLinkRequiredMessage] = useState<string | undefined>(undefined);

  function handleCreateRoutine() {
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
        if (err instanceof Error && err.message.startsWith(SUBSCRIPTION_REQUIRED_PREFIX)) {
          useSubscriptionGateStore.getState().open(err.message.slice(SUBSCRIPTION_REQUIRED_PREFIX.length));
          return;
        }
        setLinkRequiredMessage(err instanceof Error ? err.message : "Failed to create routine");
        setShowLinkRequired(true);
      }
    });
  }

  return (
    <>
      <EmptyState
        className="min-h-105 justify-center rounded-xl bg-card ring-1 ring-foreground/10"
        icon={Dumbbell}
        title="No Routines"
        description="Create a routine to reuse it across any of your programs."
        action={
          <Button
            size="lg"
            className={`w-full max-w-xs ${!isLinkedToYaaro ? "opacity-50 blur-[0.5px] grayscale hover:opacity-50" : ""}`}
            onClick={handleCreateRoutine}
            disabled={isPending}
            aria-label={isLinkedToYaaro ? "Add Routine" : "Add Routine (locked — not linked to Yaaro)"}
          >
            {isLinkedToYaaro ? <Plus /> : <Lock />}
            Add Routine
          </Button>
        }
      />
      <YaaroLinkRequiredDialog open={showLinkRequired} onOpenChange={setShowLinkRequired} message={linkRequiredMessage} />
    </>
  );
}
