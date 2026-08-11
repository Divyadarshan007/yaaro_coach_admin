import type { MeasurementFieldKey } from "@/features/clients/lib/measurement-fields";
import type { ClientMeasurement } from "@/features/clients/types/measurement";

export type MeasurementPoint = {
  date: string;
  label: string;
  value: number;
};

export type MeasurementRange = "12weeks" | "year" | "all";

export const MEASUREMENT_RANGE_LABELS: Record<MeasurementRange, string> = {
  "12weeks": "Last 12 Weeks",
  year: "Year",
  all: "All Time",
};

const MEASUREMENT_RANGE_DAYS: Record<Exclude<MeasurementRange, "all">, number> = {
  "12weeks": 12 * 7,
  year: 365,
};

export function filterSeriesByRange(series: MeasurementPoint[], range: MeasurementRange): MeasurementPoint[] {
  if (range === "all") return series;
  const cutoff = Date.now() - MEASUREMENT_RANGE_DAYS[range] * 24 * 60 * 60 * 1000;
  return series.filter((point) => new Date(point.date).getTime() >= cutoff);
}

function formatDateLabel(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// `measurements` comes in most-recent-first (backend sorts by date desc); charts read
// left-to-right chronologically, so the series is reversed to oldest-first here.
export function getMeasurementSeries(measurements: ClientMeasurement[], key: MeasurementFieldKey): MeasurementPoint[] {
  return measurements
    .filter((measurement) => measurement[key].trim() !== "")
    .map((measurement) => ({
      date: measurement.date,
      label: formatDateLabel(measurement.date),
      value: Number(measurement[key]),
    }))
    .filter((point) => Number.isFinite(point.value))
    .reverse();
}
