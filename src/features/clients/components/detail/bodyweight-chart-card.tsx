"use client";

import { ExternalLink } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { BodyweightSummary } from "@/features/clients/types/client-detail";

const chartConfig: ChartConfig = {
  value: { label: "Bodyweight", color: "var(--primary)" },
};

export function BodyweightChartCard({ bodyweight }: { bodyweight: BodyweightSummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Bodyweight</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1.5">
          <p className="text-2xl font-semibold text-foreground">
            {bodyweight.currentValue} {bodyweight.unit}
          </p>
          <ExternalLink className="size-4 text-muted-foreground" />
        </div>
        <p className="mb-4 text-sm text-muted-foreground">Last</p>
        <ChartContainer config={chartConfig} className="aspect-auto h-36 w-full">
          <LineChart data={bodyweight.data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="value"
              type="monotone"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={{ r: 4, fill: "var(--color-value)" }}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
