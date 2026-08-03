export type AdvancedStatsGranularity = "week" | "month";
export type AdvancedStatsRange = "1m" | "3m" | "6m" | "1y";

export type MuscleGroupTotal = { group: string; sets: number };

export type ClientAdvancedStats = {
  granularity: AdvancedStatsGranularity;
  range: AdvancedStatsRange;
  // ISO date (yyyy-mm-dd) marking the start of each bucket — same length/order as duration/volume/sets.
  buckets: string[];
  duration: number[]; // seconds
  volume: number[]; // kg
  sets: number[];
  muscleGroups: {
    groups: string[]; // sorted by total sets desc, over the whole range
    series: Record<string, number[]>; // per-group set counts, one entry per bucket
    totals: MuscleGroupTotal[]; // sorted desc — backs the totals table
  };
};
