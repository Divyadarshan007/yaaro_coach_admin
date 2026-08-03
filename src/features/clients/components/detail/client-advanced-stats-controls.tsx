"use client";

import { Clock, Calendar } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GRANULARITY_LABELS, RANGE_LABELS } from "@/features/clients/lib/advanced-stats-format";
import type { AdvancedStatsGranularity, AdvancedStatsRange } from "@/features/clients/types/advanced-stats";

const GRANULARITY_OPTIONS: AdvancedStatsGranularity[] = ["week", "month"];
const RANGE_OPTIONS: AdvancedStatsRange[] = ["1m", "3m", "6m", "1y"];

export function ClientAdvancedStatsControls({
  granularity,
  range,
  onGranularityChange,
  onRangeChange,
}: {
  granularity: AdvancedStatsGranularity;
  range: AdvancedStatsRange;
  onGranularityChange: (granularity: AdvancedStatsGranularity) => void;
  onRangeChange: (range: AdvancedStatsRange) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Select value={granularity} onValueChange={(value) => onGranularityChange(value as AdvancedStatsGranularity)}>
        <SelectTrigger className="w-40">
          <Clock className="size-4 text-muted-foreground" />
          <SelectValue>{(value: AdvancedStatsGranularity) => GRANULARITY_LABELS[value]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {GRANULARITY_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {GRANULARITY_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={range} onValueChange={(value) => onRangeChange(value as AdvancedStatsRange)}>
        <SelectTrigger className="w-44">
          <Calendar className="size-4 text-muted-foreground" />
          <SelectValue>{(value: AdvancedStatsRange) => RANGE_LABELS[value]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {RANGE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {RANGE_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
