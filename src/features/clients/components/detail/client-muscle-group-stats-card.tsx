"use client";

import { LineChart as LineChartIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { chartColorForIndex, formatBucketLabel, slugifyGroup } from "@/features/clients/lib/advanced-stats-format";
import type { AdvancedStatsGranularity, MuscleGroupTotal } from "@/features/clients/types/advanced-stats";

const DEFAULT_SELECTED_COUNT = 3;

export function ClientMuscleGroupStatsCard({
  buckets,
  groups,
  series,
  totals,
  granularity,
}: {
  buckets: string[];
  groups: string[];
  series: Record<string, number[]>;
  totals: MuscleGroupTotal[];
  granularity: AdvancedStatsGranularity;
}) {
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(
    () => new Set(groups.slice(0, DEFAULT_SELECTED_COUNT))
  );

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    groups.forEach((group, index) => {
      config[slugifyGroup(group)] = { label: group, color: chartColorForIndex(index) };
    });
    return config;
  }, [groups]);

  const chartData = useMemo(
    () =>
      buckets.map((bucketISO, i) => {
        const point: Record<string, string | number> = { label: formatBucketLabel(bucketISO, granularity) };
        groups.forEach((group) => {
          point[slugifyGroup(group)] = series[group]?.[i] ?? 0;
        });
        return point;
      }),
    [buckets, groups, series, granularity]
  );

  function toggleGroup(group: string) {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  }

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={LineChartIcon}
            title="No data"
            description="Your client hasn't logged any workouts in this date range."
            className="h-80 justify-center py-0"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} allowDecimals={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {groups
                .filter((group) => selectedGroups.has(group))
                .map((group) => (
                  <Line
                    key={group}
                    dataKey={slugifyGroup(group)}
                    name={group}
                    type="monotone"
                    stroke={`var(--color-${slugifyGroup(group)})`}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    isAnimationActive={false}
                  />
                ))}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Muscle group</TableHead>
                <TableHead className="text-right">Sets</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {totals.map(({ group, sets }) => (
                <TableRow key={group}>
                  <TableCell>
                    <label className="flex cursor-pointer items-center gap-3">
                      <Checkbox checked={selectedGroups.has(group)} onCheckedChange={() => toggleGroup(group)} />
                      {group}
                    </label>
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{sets}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
