import { cn } from "@/lib/utils";
import type { WeekDayActivity } from "@/features/clients/types/client";

export function ClientWeekActivity({ days }: { days: WeekDayActivity[] }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {days.map((day) => (
        <div key={day.key} className="flex flex-col items-center gap-1">
          <span className="text-[11px] text-muted-foreground">{day.dayLabel}</span>
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-full text-xs font-medium",
              day.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {day.dayNumber}
          </span>
        </div>
      ))}
    </div>
  );
}
