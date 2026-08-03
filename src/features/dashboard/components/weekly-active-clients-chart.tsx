"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatBucketLabel } from "@/features/clients/lib/advanced-stats-format";
import type { WeeklyActiveClients } from "@/features/dashboard/types/dashboard";

const chartConfig: ChartConfig = {
  count: { label: "Active clients", color: "var(--chart-1)" },
};

export function WeeklyActiveClientsChart({ data }: { data: WeeklyActiveClients }) {
  const chartData = data.weeks.map((week) => ({
    label: formatBucketLabel(week.weekStart, "week"),
    rangeLabel: `${formatBucketLabel(week.weekStart, "week")} - ${formatBucketLabel(week.weekEnd, "week")}`,
    count: week.count,
  }));

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} interval={1} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          allowDecimals={false}
          domain={[0, Math.max(data.totalClients, 1)]}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideIndicator
              labelFormatter={(_, payload) => payload?.[0]?.payload?.rangeLabel ?? ""}
              formatter={(value) => (
                <span className="font-mono font-medium text-foreground tabular-nums">
                  {Number(value)} out of {data.totalClients} clients
                </span>
              )}
            />
          }
        />
        <Bar dataKey="count" name="count" fill="var(--color-count)" radius={4} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  );
}
