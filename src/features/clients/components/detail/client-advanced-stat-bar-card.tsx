"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { EmptyState } from "@/components/shared/empty-state";
import { BarChart3 } from "lucide-react";

const chartConfig: ChartConfig = {
  value: { label: "Value", color: "var(--chart-1)" },
};

export function ClientAdvancedStatBarCard({
  data,
  formatValue,
}: {
  data: { label: string; value: number }[];
  formatValue: (value: number) => string;
}) {
  const hasData = data.some((point) => point.value > 0);

  if (!hasData) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={BarChart3}
            title="No data"
            description="Your client hasn't logged any workouts in this date range."
            className="h-80 justify-center py-0"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} tickFormatter={formatValue} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => (
                    <span className="font-mono font-medium text-foreground tabular-nums">{formatValue(Number(value))}</span>
                  )}
                />
              }
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={4} isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
