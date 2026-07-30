"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { StatSummary } from "@/features/clients/types/client-detail";

const chartConfig: ChartConfig = {
  value: { label: "Value", color: "var(--primary)" },
};

export function StatChartCard({ stat }: { stat: StatSummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-foreground">{stat.displayValue}</p>
        <p className="mb-4 text-sm text-muted-foreground">{stat.subLabel}</p>
        <ChartContainer config={chartConfig} className="aspect-auto h-36 w-full">
          <BarChart data={stat.data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={4} isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
