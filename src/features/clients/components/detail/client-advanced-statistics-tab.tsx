"use client";

import { useEffect, useState, useTransition } from "react";

import { getClientAdvancedStatsAction } from "@/features/clients/actions";
import { ClientAdvancedStatBarCard } from "@/features/clients/components/detail/client-advanced-stat-bar-card";
import { ClientAdvancedStatsControls } from "@/features/clients/components/detail/client-advanced-stats-controls";
import {
  ClientAdvancedStatsListPanel,
  type AdvancedStatsMetric,
} from "@/features/clients/components/detail/client-advanced-stats-list-panel";
import { ClientMuscleGroupStatsCard } from "@/features/clients/components/detail/client-muscle-group-stats-card";
import { formatBucketLabel, secondsToHours } from "@/features/clients/lib/advanced-stats-format";
import type { AdvancedStatsGranularity, AdvancedStatsRange, ClientAdvancedStats } from "@/features/clients/types/advanced-stats";

const METRIC_TITLES: Record<AdvancedStatsMetric, string> = {
  "muscle-groups": "Set Count Per Muscle Group",
  duration: "Duration",
  volume: "Volume",
  sets: "Sets",
};

function formatHours(value: number): string {
  return `${value}h`;
}

function formatKg(value: number): string {
  return value >= 1000 ? `${Math.round((value / 1000) * 10) / 10}k kg` : `${value} kg`;
}

function formatSets(value: number): string {
  return `${value} sets`;
}

export function ClientAdvancedStatisticsTab({ clientId }: { clientId: string }) {
  const [metric, setMetric] = useState<AdvancedStatsMetric>("muscle-groups");
  const [granularity, setGranularity] = useState<AdvancedStatsGranularity>("week");
  const [range, setRange] = useState<AdvancedStatsRange>("3m");
  const [stats, setStats] = useState<ClientAdvancedStats | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await getClientAdvancedStatsAction(clientId, { granularity, range });
      setStats(result);
    });
  }, [clientId, granularity, range]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
      <ClientAdvancedStatsListPanel selectedMetric={metric} onSelect={setMetric} />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-medium text-foreground">{METRIC_TITLES[metric]}</h2>
          <ClientAdvancedStatsControls
            granularity={granularity}
            range={range}
            onGranularityChange={setGranularity}
            onRangeChange={setRange}
          />
        </div>

        {isPending || !stats ? (
          <div className="h-80 animate-pulse rounded-xl bg-muted/50" />
        ) : metric === "muscle-groups" ? (
          <ClientMuscleGroupStatsCard
            buckets={stats.buckets}
            groups={stats.muscleGroups.groups}
            series={stats.muscleGroups.series}
            totals={stats.muscleGroups.totals}
            granularity={stats.granularity}
          />
        ) : (
          <ClientAdvancedStatBarCard
            data={stats.buckets.map((bucketISO, i) => ({
              label: formatBucketLabel(bucketISO, stats.granularity),
              value:
                metric === "duration"
                  ? secondsToHours(stats.duration[i])
                  : metric === "volume"
                    ? stats.volume[i]
                    : stats.sets[i],
            }))}
            formatValue={metric === "duration" ? formatHours : metric === "volume" ? formatKg : formatSets}
          />
        )}
      </div>
    </div>
  );
}
