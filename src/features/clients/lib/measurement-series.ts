import type { MeasurementFieldKey } from "@/features/clients/lib/measurement-fields";
import type { ClientMeasurement } from "@/features/clients/types/measurement";

export type MeasurementPoint = {
  date: string;
  label: string;
  value: number;
};

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
