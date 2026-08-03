import type { AdvancedStatsGranularity, AdvancedStatsRange } from "@/features/clients/types/advanced-stats";

export const RANGE_LABELS: Record<AdvancedStatsRange, string> = {
  "1m": "Last month",
  "3m": "Last 3 months",
  "6m": "Last 6 months",
  "1y": "Last year",
};

export const GRANULARITY_LABELS: Record<AdvancedStatsGranularity, string> = {
  week: "Week",
  month: "Month",
};

// Cycles through the app's monochrome chart palette (--chart-1..5) so any number of
// selected muscle-group lines still gets a distinct, on-brand color.
const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function chartColorForIndex(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

export function formatBucketLabel(bucketDate: string, granularity: AdvancedStatsGranularity): string {
  const date = new Date(`${bucketDate}T00:00:00Z`);
  if (granularity === "month") {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

export function secondsToHours(seconds: number): number {
  return Math.round((seconds / 3600) * 10) / 10;
}

// Recharts dataKeys / CSS custom-property names can't contain spaces (muscle group
// names like "Upper Back" would otherwise produce an invalid "--color-Upper Back").
export function slugifyGroup(group: string): string {
  return group.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "other";
}
