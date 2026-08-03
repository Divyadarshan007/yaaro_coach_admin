"use client";

import { BarChart3, LineChart } from "lucide-react";

import { cn } from "@/lib/utils";

export type AdvancedStatsMetric = "muscle-groups" | "duration" | "volume" | "sets";

const METRICS: { key: AdvancedStatsMetric; label: string; icon: typeof LineChart }[] = [
  { key: "muscle-groups", label: "Set Count Per Muscle Group", icon: LineChart },
  { key: "duration", label: "Duration", icon: BarChart3 },
  { key: "volume", label: "Volume", icon: BarChart3 },
  { key: "sets", label: "Sets", icon: BarChart3 },
];

export function ClientAdvancedStatsListPanel({
  selectedMetric,
  onSelect,
}: {
  selectedMetric: AdvancedStatsMetric;
  onSelect: (metric: AdvancedStatsMetric) => void;
}) {
  return (
    <div className="flex h-fit flex-col gap-1 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      {METRICS.map((metric) => (
        <button
          key={metric.key}
          type="button"
          onClick={() => onSelect(metric.key)}
          className={cn(
            "flex items-center gap-3 rounded-lg p-2 text-left text-sm font-medium text-foreground hover:bg-muted/50",
            selectedMetric === metric.key && "bg-muted"
          )}
        >
          <metric.icon className="size-4 shrink-0 text-muted-foreground" />
          {metric.label}
        </button>
      ))}
    </div>
  );
}
