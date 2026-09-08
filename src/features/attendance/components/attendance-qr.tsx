"use client";

import { forwardRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

// A real <canvas>, not the SVG variant — so the download flow can read its pixels
// straight off this element (see render-attendance-card.ts) with no re-render/re-encode.
export const AttendanceQr = forwardRef<HTMLCanvasElement, { value: string; size: number }>(
  function AttendanceQr({ value, size }, ref) {
    return (
      <div className="rounded-xl bg-white p-4 ring-1 ring-foreground/10">
        <QRCodeCanvas ref={ref} value={value} size={size} marginSize={0} level="M" />
      </div>
    );
  }
);
