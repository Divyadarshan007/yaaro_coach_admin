import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
export const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
export const PERIODS = ["AM", "PM"] as const;

export type Period = (typeof PERIODS)[number];

// 12h parts -> 24h "HH:mm"
export function to24h(hour12: number, minute: string, period: Period): string {
  let h = hour12 % 12;
  if (period === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

// 24h "HH:mm" -> 12h parts
export function from24h(hhmm: string): { hour: number; minute: string; period: Period } {
  const [hStr, minute] = hhmm.split(":");
  const h = Number(hStr);
  const period: Period = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return { hour, minute: minute ?? "00", period };
}

export function TimeField({
  label,
  hour,
  minute,
  period,
  onHour,
  onMinute,
  onPeriod,
}: {
  label: string;
  hour: number;
  minute: string;
  period: Period;
  onHour: (v: number) => void;
  onMinute: (v: string) => void;
  onPeriod: (v: Period) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-2">
        <Select<string> value={String(hour)} onValueChange={(v) => v && onHour(Number(v))}>
          <SelectTrigger className="min-w-0 px-2.5">
            <SelectValue>{(v: string) => v}</SelectValue>
          </SelectTrigger>
          <SelectContent className="min-w-16">
            {HOURS_12.map((h) => (
              <SelectItem key={h} value={String(h)}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select<string> value={minute} onValueChange={(v) => v && onMinute(v)}>
          <SelectTrigger className="min-w-0 px-2.5">
            <SelectValue>{(v: string) => v}</SelectValue>
          </SelectTrigger>
          <SelectContent className="min-w-16">
            {MINUTES.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select<Period> value={period} onValueChange={(v) => v && onPeriod(v)}>
          <SelectTrigger className="min-w-0 px-2.5">
            <SelectValue>{(v: Period) => v}</SelectValue>
          </SelectTrigger>
          <SelectContent className="min-w-16">
            {PERIODS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
