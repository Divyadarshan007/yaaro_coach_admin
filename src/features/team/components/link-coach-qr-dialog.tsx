"use client";

import { QRCodeSVG } from "qrcode.react";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function LinkCoachQrDialog({
  memberName,
  joinTeamQrValue,
  open,
  onOpenChange,
}: {
  memberName: string;
  joinTeamQrValue: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Link {memberName}&apos;s account</DialogTitle>
          <DialogDescription>
            Ask {memberName} to open the Yaaro app and scan this code to link
            their account to the team.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <QRCodeSVG value={joinTeamQrValue} size={220} marginSize={0} />
            </div>
            <p className="text-center text-sm font-medium text-foreground">
              {memberName}
            </p>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
