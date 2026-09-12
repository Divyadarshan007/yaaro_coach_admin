"use client";

import { QRCodeSVG } from "qrcode.react";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STEPS = ["Open Yaaro App", "Go to Profile", "Click on QR and Scan"];

export function LinkClientQrDialog({
  clientName,
  linkQrValue,
  studioName,
  open,
  onOpenChange,
}: {
  clientName: string;
  linkQrValue: string;
  studioName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Link Account</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div>
            <p className="text-sm text-muted-foreground">
              You are about to link
            </p>
            <p className="text-xl font-semibold text-foreground">
              {clientName}
            </p>
          </div>

          <ol className="flex flex-col gap-1.5 text-sm text-foreground">
            {STEPS.map((step, index) => (
              <li key={step} className="flex gap-2">
                <span className="text-muted-foreground">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ol>

          <div className="flex flex-col items-center gap-2 py-2">
            <div className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <QRCodeSVG value={linkQrValue} size={220} marginSize={0} />
            </div>
            <p className="text-center text-sm font-medium text-muted-foreground">
              {studioName}
            </p>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
