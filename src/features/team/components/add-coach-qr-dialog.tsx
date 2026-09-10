"use client";

import { QRCodeSVG } from "qrcode.react";
import { Plus } from "lucide-react";

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

export function AddCoachQrDialog({
  joinCoachQrValue,
  studioName,
}: {
  joinCoachQrValue: string;
  studioName: string;
}) {
  return (
    <Dialog>
      <DialogTrigger render={<Button size="lg" />}>
        <Plus />
        Add Coach
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add a coach by QR</DialogTitle>
          <DialogDescription>
            Ask the coach to open the Yaaro app and scan this code. They&apos;ll be added to your
            team as a coach right away.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
              <QRCodeSVG value={joinCoachQrValue} size={220} marginSize={0} />
            </div>
            <p className="text-center text-sm font-medium text-foreground">{studioName}</p>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
