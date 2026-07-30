import type { WeekDayActivity } from "@/features/clients/types/client";

export function getLastSevenDaysActivity(today: Date, activeDayOffsets: number[]): WeekDayActivity[] {
  const days: WeekDayActivity[] = [];

  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(today);
    date.setDate(date.getDate() - offset);

    days.push({
      key: date.toISOString().slice(0, 10),
      dayLabel: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
      dayNumber: date.getDate(),
      active: activeDayOffsets.includes(offset),
    });
  }

  return days;
}
