"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Unsaved changes</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-muted-foreground">
            You have unsaved changes. If you leave now, they&apos;ll be lost.
          </p>
        </DialogBody>
        <DialogFooter className="flex-row justify-end">
          <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
            Keep editing
          </Button>
          <Button variant="destructive" size="lg" onClick={onConfirm}>
            Leave without saving
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
