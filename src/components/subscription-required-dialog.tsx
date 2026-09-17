"use client";

import { CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubscriptionGateStore } from "@/lib/subscription-gate-store";

// Mounted once in (main)/layout.tsx — driven entirely by useSubscriptionGateStore, opened by
// handleMutationError whenever a create/update/delete call is blocked because the studio
// has no active subscription.
export function SubscriptionRequiredDialog() {
  const isOpen = useSubscriptionGateStore((state) => state.isOpen);
  const message = useSubscriptionGateStore((state) => state.message);
  const close = useSubscriptionGateStore((state) => state.close);

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !next && close()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Subscription required</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex items-start gap-3">
            <CircleAlert className="size-5 shrink-0 text-destructive" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </DialogBody>
        <DialogFooter className="flex-row justify-end">
          <Button size="lg" onClick={close}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
