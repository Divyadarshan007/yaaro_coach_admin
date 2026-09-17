"use client";

import { Check, Download, Lock } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import { useIsLinkedToYaaro } from "@/features/program-library/lib/yaaro-link-context";
import { YaaroLinkRequiredDialog } from "@/features/program-library/components/yaaro-link-required-dialog";
import { useSubscriptionGateStore } from "@/lib/subscription-gate-store";
import { SUBSCRIPTION_REQUIRED_PREFIX } from "@/lib/subscription-required";

export function AddToMyLibraryButton({ programId }: { programId: string }) {
  const duplicateProgram = useMyProgramsStore((state) => state.duplicateProgram);
  const isLinkedToYaaro = useIsLinkedToYaaro();
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);
  const [showLinkRequired, setShowLinkRequired] = useState(false);
  const [linkRequiredMessage, setLinkRequiredMessage] = useState<string | undefined>(undefined);

  function handleAdd() {
    if (!isLinkedToYaaro) {
      setLinkRequiredMessage(undefined);
      setShowLinkRequired(true);
      return;
    }

    startTransition(async () => {
      try {
        await duplicateProgram(programId);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      } catch (err) {
        if (err instanceof Error && err.message.startsWith(SUBSCRIPTION_REQUIRED_PREFIX)) {
          useSubscriptionGateStore.getState().open(err.message.slice(SUBSCRIPTION_REQUIRED_PREFIX.length));
          return;
        }
        setLinkRequiredMessage(err instanceof Error ? err.message : "Failed to add program");
        setShowLinkRequired(true);
      }
    });
  }

  return (
    <>
      <Button
        size="lg"
        variant={justAdded ? "outline" : "default"}
        disabled={isPending || justAdded}
        onClick={handleAdd}
        aria-label={isLinkedToYaaro ? "Add to My Library" : "Add to My Library (locked — not linked to Yaaro)"}
        className={!isLinkedToYaaro ? "opacity-50 blur-[0.5px] grayscale hover:opacity-50" : undefined}
      >
        {justAdded ? <Check /> : isLinkedToYaaro ? <Download /> : <Lock />}
        {justAdded ? "Added to Library" : "Add to My Library"}
      </Button>
      <YaaroLinkRequiredDialog open={showLinkRequired} onOpenChange={setShowLinkRequired} message={linkRequiredMessage} />
    </>
  );
}
