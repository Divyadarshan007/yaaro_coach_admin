import type { WeeklyChartAxis } from "@/features/dashboard/types/dashboard";

export function WeeklyActiveClientsChart({ axis }: { axis: WeeklyChartAxis }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 gap-2">
        <div className="flex w-6 shrink-0 flex-col justify-between py-1 text-xs text-muted-foreground">
          {axis.yTicks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-0 flex flex-col justify-between">
            {axis.yTicks.map((tick) => (
              <div key={tick} className="border-t border-border" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-2 pl-8 text-xs text-muted-foreground">
        {axis.weekLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
