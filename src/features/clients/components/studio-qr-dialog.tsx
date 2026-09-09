"use client";

import { QRCodeSVG } from "qrcode.react";
import { QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type StudioQrDialogProps = {
  joinQrValue: string;
  studioName: string;
};

export function StudioQrDialog({ joinQrValue, studioName }: StudioQrDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="outline" size="icon-lg" aria-label="Show join QR code" />}
      >
        <QrCode />
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add a client by QR</DialogTitle>
          <DialogDescription>
            Ask the person to open the Yaaro app and scan this code. Once you approve their
            request, they&apos;ll appear in your client list.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <QRCodeSVG value={joinQrValue} size={220} marginSize={0} />
            </div>
            <p className="text-center text-sm font-medium text-foreground">{studioName}</p>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
