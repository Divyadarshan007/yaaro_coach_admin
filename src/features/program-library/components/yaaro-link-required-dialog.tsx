"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Shown instead of letting the create/add-to-library actions run when the coach hasn't
// linked a Yaaro app account yet — see coach/controllers/program_ctrl.js create(),
// coach/controllers/routine_ctrl.js create(), and YaaroLinkProvider. `message` lets a
// caller pass the backend's own error text (e.g. if this fires as a fallback after an
// API call rather than proactively); otherwise a default explanation is shown.
export function YaaroLinkRequiredDialog({
  open,
  onOpenChange,
  message,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="size-4" />
            Not Linked to Yaaro
          </DialogTitle>
          <DialogDescription>{message || "You are not linked to Yaaro"}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-muted-foreground">
            Link your account to the Yaaro app to create or add programs and routines. Go to the Team page
            and scan your own &quot;Link now&quot; QR code with the Yaaro app.
          </p>
        </DialogBody>
        <DialogFooter className="flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button nativeButton={false} render={<Link href="/team" />} onClick={() => onOpenChange(false)}>
            Go to Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
