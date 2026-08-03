"use client";

import { BarChart3, Calendar, ChevronDown, CircleArrowRight } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { EmptyState } from "@/components/shared/empty-state";
import { MEASUREMENT_FIELDS, MEASUREMENT_UNIT_BY_KEY, type MeasurementFieldKey } from "@/features/clients/lib/measurement-fields";
import { getMeasurementSeries } from "@/features/clients/lib/measurement-series";
import type { ClientMeasurement } from "@/features/clients/types/measurement";

const chartConfig: ChartConfig = {
  value: { label: "Value", color: "var(--primary)" },
};

export function ClientBodyMeasurementDetailPanel({
  selectedKey,
  measurements,
}: {
  selectedKey: MeasurementFieldKey;
  measurements: ClientMeasurement[];
}) {
  const field = MEASUREMENT_FIELDS.find((f) => f.key === selectedKey)!;
  const unit = MEASUREMENT_UNIT_BY_KEY[selectedKey];
  const series = getMeasurementSeries(measurements, selectedKey);
  const last = series[series.length - 1] ?? null;
  const history = [...series].reverse();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">{field.label}</h2>
        <Button variant="outline" size="sm" disabled>
          <Calendar />
          All Time
          <ChevronDown />
        </Button>
      </div>

      <Card>
        <CardContent>
          {last ? (
            <>
              <p className="text-sm text-muted-foreground">Last</p>
              <p className="mb-4 text-2xl font-semibold text-foreground">
                {last.value} {unit}
              </p>
              <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
                <LineChart data={series}>
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
            </>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No data"
              description={`Your client hasn't logged a ${field.label.toLowerCase()} measurement yet.`}
              className="h-64 justify-center py-0"
            />
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-medium text-foreground">History</h3>
          <Card size="sm">
            <CardContent className="flex flex-col gap-1">
              {history.map((point, index) => (
                <div
                  key={point.date}
                  className={
                    index < history.length - 1
                      ? "flex items-center justify-between gap-4 border-b border-border py-2.5"
                      : "flex items-center justify-between gap-4 py-2.5"
                  }
                >
                  <div className="flex items-center gap-3">
                    <CircleArrowRight className="size-5 shrink-0 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {point.value} {unit}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{point.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
