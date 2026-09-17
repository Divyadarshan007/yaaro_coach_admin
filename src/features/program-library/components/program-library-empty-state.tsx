"use client";

import { ClipboardList, Lock, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import { useIsLinkedToYaaro } from "@/features/program-library/lib/yaaro-link-context";
import { YaaroLinkRequiredDialog } from "@/features/program-library/components/yaaro-link-required-dialog";
import { useSubscriptionGateStore } from "@/lib/subscription-gate-store";
import { SUBSCRIPTION_REQUIRED_PREFIX } from "@/lib/subscription-required";

export function ProgramLibraryEmptyState() {
  const router = useRouter();
  const createProgram = useMyProgramsStore((state) => state.createProgram);
  const isLinkedToYaaro = useIsLinkedToYaaro();
  const [isPending, startTransition] = useTransition();
  const [showLinkRequired, setShowLinkRequired] = useState(false);
  const [linkRequiredMessage, setLinkRequiredMessage] = useState<string | undefined>(undefined);

  function handleCreateProgram() {
    if (!isLinkedToYaaro) {
      setLinkRequiredMessage(undefined);
      setShowLinkRequired(true);
      return;
    }

    startTransition(async () => {
      try {
        const id = await createProgram();
        router.push(`/program/${id}`);
      } catch (err) {
        if (err instanceof Error && err.message.startsWith(SUBSCRIPTION_REQUIRED_PREFIX)) {
          useSubscriptionGateStore.getState().open(err.message.slice(SUBSCRIPTION_REQUIRED_PREFIX.length));
          return;
        }
        setLinkRequiredMessage(err instanceof Error ? err.message : "Failed to create program");
        setShowLinkRequired(true);
      }
    });
  }

  return (
    <>
      <EmptyState
        className="min-h-105 justify-center rounded-xl bg-card ring-1 ring-foreground/10"
        icon={ClipboardList}
        title="No Workout Programs"
        description="Create your own workout program to get started."
        action={
          <Button
            size="lg"
            className={`w-full max-w-xs ${!isLinkedToYaaro ? "opacity-50 blur-[0.5px] grayscale hover:opacity-50" : ""}`}
            onClick={handleCreateProgram}
            disabled={isPending}
            aria-label={isLinkedToYaaro ? "Create Workout Program" : "Create Workout Program (locked — not linked to Yaaro)"}
          >
            {isLinkedToYaaro ? <Plus /> : <Lock />}
            Create Workout Program
          </Button>
        }
      />
      <YaaroLinkRequiredDialog open={showLinkRequired} onOpenChange={setShowLinkRequired} message={linkRequiredMessage} />
    </>
  );
}
