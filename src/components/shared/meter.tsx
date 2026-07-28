"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type MeterProps = {
  value: number;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
};

export function Meter({ value, className, trackClassName, indicatorClassName }: MeterProps) {
  return (
    <ProgressPrimitive.Root value={value} className={cn("w-full", className)}>
      <ProgressTrack className={cn("bg-primary/15", trackClassName)}>
        <ProgressIndicator className={cn("bg-primary", indicatorClassName)} />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  );
}
