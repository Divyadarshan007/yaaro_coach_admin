"use client";

import { BarChart3, Calendar, CircleArrowRight } from "lucide-react";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { MEASUREMENT_FIELDS, MEASUREMENT_UNIT_BY_KEY, type MeasurementFieldKey } from "@/features/clients/lib/measurement-fields";
import {
  filterSeriesByRange,
  getMeasurementSeries,
  MEASUREMENT_RANGE_LABELS,
  type MeasurementRange,
} from "@/features/clients/lib/measurement-series";
import type { ClientMeasurement } from "@/features/clients/types/measurement";

const chartConfig: ChartConfig = {
  value: { label: "Value", color: "var(--primary)" },
};

const RANGE_OPTIONS: MeasurementRange[] = ["12weeks", "year", "all"];

export function ClientBodyMeasurementDetailPanel({
  selectedKey,
  measurements,
}: {
  selectedKey: MeasurementFieldKey;
  measurements: ClientMeasurement[];
}) {
  const [range, setRange] = useState<MeasurementRange>("all");
  const field = MEASUREMENT_FIELDS.find((f) => f.key === selectedKey)!;
  const unit = MEASUREMENT_UNIT_BY_KEY[selectedKey];
  const series = filterSeriesByRange(getMeasurementSeries(measurements, selectedKey), range);
  const last = series[series.length - 1] ?? null;
  const history = [...series].reverse();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">{field.label}</h2>
        <Select value={range} onValueChange={(value) => setRange(value as MeasurementRange)}>
          <SelectTrigger className="w-auto">
            <Calendar className="size-4 text-muted-foreground" />
            <SelectValue>{(value: MeasurementRange) => MEASUREMENT_RANGE_LABELS[value]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {MEASUREMENT_RANGE_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
