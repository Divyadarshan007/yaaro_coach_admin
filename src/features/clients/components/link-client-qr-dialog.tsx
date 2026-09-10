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

export function LinkClientQrDialog({
  clientName,
  linkQrValue,
  open,
  onOpenChange,
}: {
  clientName: string;
  linkQrValue: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Link {clientName}&apos;s account</DialogTitle>
          <DialogDescription>
            Ask {clientName} to open the Yaaro app and scan this code. Their account will be linked to
            this client record right away.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <QRCodeSVG value={linkQrValue} size={220} marginSize={0} />
            </div>
            <p className="text-center text-sm font-medium text-foreground">{clientName}</p>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
