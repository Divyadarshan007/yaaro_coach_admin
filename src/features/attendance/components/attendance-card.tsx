"use client";

import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AttendanceQr } from "@/features/attendance/components/attendance-qr";
import { renderAttendanceCardBlob } from "@/features/attendance/lib/render-attendance-card";
import { saveBlobAsImage, slugify } from "@/features/attendance/lib/save-image";

const QR_SIZE = 220;

// The scannable card meant to be shown on a screen/tablet at the front desk (or
// printed/downloaded). Members scan it from the yaaro app to mark today's attendance.
export function AttendanceCard({
  studioName,
  qrValue,
}: {
  studioName: string;
  qrValue: string;
}) {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function handleDownload() {
    if (!qrCanvasRef.current || saving) return;
    setSaving(true);
    setError(false);
    try {
      const blob = await renderAttendanceCardBlob({
        studioName,
        qrCanvas: qrCanvasRef.current,
        qrSize: QR_SIZE,
      });
      await saveBlobAsImage(blob, `attendance-qr-${slugify(studioName)}.png`);
    } catch (err) {
      // Surface the real reason on live — the generic message below hides it.
      console.error("Attendance card download failed:", err);
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-card px-6 py-8 text-center ring-1 ring-foreground/10">
        <h2 className="font-heading text-xl font-medium text-foreground">{studioName}</h2>
        <p className="text-sm text-muted-foreground">Scan for attendance</p>
        <AttendanceQr ref={qrCanvasRef} value={qrValue} size={QR_SIZE} />
        <p className="text-xs text-muted-foreground">
          Powered by <span className="font-medium text-foreground">yaaro.fit</span>
        </p>
      </div>

      <Button type="button" variant="outline" onClick={handleDownload} disabled={saving} className="gap-2">
        {saving ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        {saving ? "Preparing…" : "Download"}
      </Button>
      {error && <p className="text-xs text-destructive">Couldn&apos;t save the image. Try again.</p>}
    </div>
  );
}
