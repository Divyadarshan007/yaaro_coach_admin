"use client";

import { Lock, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import { useIsLinkedToYaaro } from "@/features/program-library/lib/yaaro-link-context";
import { YaaroLinkRequiredDialog } from "@/features/program-library/components/yaaro-link-required-dialog";
import { useSubscriptionGateStore } from "@/lib/subscription-gate-store";
import { SUBSCRIPTION_REQUIRED_PREFIX } from "@/lib/subscription-required";

export function ProgramLibraryToolbar() {
  const router = useRouter();
  const createProgram = useMyProgramsStore((state) => state.createProgram);
  const isLinkedToYaaro = useIsLinkedToYaaro();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [showLinkRequired, setShowLinkRequired] = useState(false);
  const [linkRequiredMessage, setLinkRequiredMessage] = useState<string | undefined>(undefined);

  function handleCreateProgram() {
    // Not linked yet — don't even call the (gated) backend, just explain why the
    // button is locked. See YaaroLinkProvider / coach/controllers/program_ctrl.js.
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
        // Fallback for a race (e.g. link status changed after this page loaded) —
        // still shown as the same popup, not an inline message or a crashed page.
        setLinkRequiredMessage(err instanceof Error ? err.message : "Failed to create program");
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
          placeholder="Search programs"
          className="h-9 w-full pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="lg"
          onClick={handleCreateProgram}
          disabled={isPending}
          aria-label={isLinkedToYaaro ? "Create Workout Program" : "Create Workout Program (locked — not linked to Yaaro)"}
          className={!isLinkedToYaaro ? "opacity-50 blur-[0.5px] grayscale hover:opacity-50" : undefined}
        >
          {isLinkedToYaaro ? <Plus /> : <Lock />}
          Create Workout Program
        </Button>
      </div>
      <YaaroLinkRequiredDialog open={showLinkRequired} onOpenChange={setShowLinkRequired} message={linkRequiredMessage} />
    </div>
  );
}
