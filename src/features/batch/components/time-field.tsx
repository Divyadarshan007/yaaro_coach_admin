"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

type Period = "AM" | "PM";

// Split a 24h "HH:mm" string into 12h parts. Returns empty parts for anything
// that isn't a valid "HH:mm".
function to12h(value: string): { hour: string; minute: string; period: Period } {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return { hour: "", minute: "", period: "AM" };
  let hour = Number(match[1]);
  const period: Period = hour < 12 ? "AM" : "PM";
  hour %= 12;
  if (hour === 0) hour = 12;
  return { hour: String(hour), minute: match[2], period };
}

// Recombine 12h parts back into a 24h "HH:mm" string, or "" while incomplete/invalid.
function to24h(hour: string, minute: string, period: Period): string {
  const h = Number(hour);
  const m = Number(minute);
  if (!Number.isInteger(h) || h < 1 || h > 12) return "";
  if (!Number.isInteger(m) || m < 0 || m > 59) return "";
  let h24 = h % 12;
  if (period === "PM") h24 += 12;
  return `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function digitsOnly(raw: string, max: number): string {
  return raw.replace(/\D/g, "").slice(0, max);
}

type TimeFieldProps = {
  label: string;
  value: string; // "HH:mm" (24h) or ""
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function TimeField({ label, value, onChange, disabled }: TimeFieldProps) {
  const labelId = useId();
  const initial = to12h(value);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState<Period>(initial.period);

  function commit(nextHour: string, nextMinute: string, nextPeriod: Period) {
    setHour(nextHour);
    setMinute(nextMinute);
    setPeriod(nextPeriod);
    onChange(to24h(nextHour, nextMinute, nextPeriod));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span id={labelId} className="text-sm font-medium text-foreground">
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        className={cn(
          "flex h-9 w-fit items-center gap-1 rounded-lg border border-input bg-background px-2.5 text-sm",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <input
          aria-label="Hour"
          inputMode="numeric"
          maxLength={2}
          placeholder="--"
          disabled={disabled}
          value={hour}
          onChange={(event) => commit(digitsOnly(event.target.value, 2), minute, period)}
          onBlur={() => {
            const h = Number(hour);
            if (Number.isInteger(h) && h >= 1 && h <= 12) commit(String(h), minute, period);
          }}
          className="w-6 bg-transparent text-center tabular-nums outline-none placeholder:text-muted-foreground"
        />
        <span className="text-muted-foreground">:</span>
        <input
          aria-label="Minute"
          inputMode="numeric"
          maxLength={2}
          placeholder="--"
          disabled={disabled}
          value={minute}
          onChange={(event) => commit(hour, digitsOnly(event.target.value, 2), period)}
          onBlur={() => {
            const m = Number(minute);
            if (Number.isInteger(m) && m >= 0 && m <= 59) {
              commit(hour, String(m).padStart(2, "0"), period);
            }
          }}
          className="w-6 bg-transparent text-center tabular-nums outline-none placeholder:text-muted-foreground"
        />
        <div className="ml-1 flex items-center gap-0.5 border-l border-input pl-1.5">
          {(["AM", "PM"] as Period[]).map((option) => (
            <button
              key={option}
              type="button"
              disabled={disabled}
              aria-pressed={period === option}
              onClick={() => commit(hour, minute, option)}
              className={cn(
                "rounded px-1.5 py-0.5 text-xs font-medium transition-colors",
                period === option
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
