import { formatBucketLabel } from "@/features/clients/lib/advanced-stats-format";
import type { ClientAdvancedStats } from "@/features/clients/types/advanced-stats";
import type { BodyweightSummary, ProgressPicture, StatSummary } from "@/features/clients/types/client-detail";
import type { ClientMeasurement } from "@/features/clients/types/measurement";

function formatDurationDisplay(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}min`;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`;
}

function formatVolumeDisplay(kg: number): string {
  return `${Math.round(kg).toLocaleString("en-US")} kg`;
}

function formatSetsDisplay(count: number): string {
  return `${count} sets`;
}

// Duration/volume/sets "this week" cards on the Overview tab reuse the same weekly-bucketed
// advanced-stats endpoint as the Advanced Statistics tab — "this week" is just its last bucket.
export function buildOverviewStats(stats: ClientAdvancedStats | null): {
  duration: StatSummary;
  volume: StatSummary;
  sets: StatSummary;
} {
  const buckets = stats?.buckets ?? [];
  const granularity = stats?.granularity ?? "week";
  const durationMinutes = (stats?.duration ?? []).map((seconds) => Math.round(seconds / 60));
  const volume = stats?.volume ?? [];
  const sets = stats?.sets ?? [];

  function chartData(values: number[]) {
    return buckets.map((bucketISO, i) => ({ label: formatBucketLabel(bucketISO, granularity), value: values[i] ?? 0 }));
  }

  return {
    duration: {
      label: "Duration",
      displayValue: formatDurationDisplay(durationMinutes[durationMinutes.length - 1] ?? 0),
      subLabel: "This week",
      data: chartData(durationMinutes),
    },
    volume: {
      label: "Volume",
      displayValue: formatVolumeDisplay(volume[volume.length - 1] ?? 0),
      subLabel: "This week",
      data: chartData(volume),
    },
    sets: {
      label: "Set",
      displayValue: formatSetsDisplay(sets[sets.length - 1] ?? 0),
      subLabel: "This week",
      data: chartData(sets),
    },
  };
}

function formatShortDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function buildBodyweightSummary(measurements: ClientMeasurement[]): BodyweightSummary {
  const weighIns = measurements
    .filter((measurement) => measurement.weight.trim() !== "" && !Number.isNaN(Number(measurement.weight)))
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  const latest = weighIns[weighIns.length - 1];
  return {
    currentValue: latest ? Number(latest.weight) : 0,
    unit: "kg",
    data: weighIns.map((measurement) => ({
      label: formatShortDate(measurement.date),
      value: Number(measurement.weight),
    })),
  };
}

export function buildProgressPictures(measurements: ClientMeasurement[]): ProgressPicture[] {
  return measurements
    .filter((measurement) => measurement.image.trim() !== "")
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((measurement) => ({
      id: measurement.id,
      dateLabel: formatShortDate(measurement.date),
      weightLabel: measurement.weight ? `${measurement.weight} kg` : "",
      imageUrl: measurement.image,
    }));
}
