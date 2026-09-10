"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { Clock } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

type Period = "AM" | "PM";

const PICKER_HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
const PICKER_MINUTES = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];

// Split a 24h "HH:mm" string into 12h parts. Returns empty parts for anything
// that isn't a valid "HH:mm".
function to12h(value: string): {
  hour: string;
  minute: string;
  period: Period;
} {
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
  if (hour === "" || !Number.isInteger(h) || h < 1 || h > 12) return "";
  if (minute === "" || !Number.isInteger(m) || m < 0 || m > 59) return "";
  let h24 = h % 12;
  if (period === "PM") h24 += 12;
  return `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Digits only, capped length, then clamped to [0, max] so a bad manual entry can
// never produce an out-of-range hour/minute.
function clampDigits(raw: string, maxLen: number, max: number): string {
  const digits = raw.replace(/\D/g, "").slice(0, maxLen);
  if (digits === "") return "";
  const n = Number(digits);
  return n > max ? String(max) : digits;
}

type TimeFieldProps = {
  label: string;
  value: string; // "HH:mm" (24h) or ""
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function TimeField({
  label,
  value,
  onChange,
  disabled,
}: TimeFieldProps) {
  const labelId = useId();
  const initial = to12h(value);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState<Period>(initial.period);
  const [touched, setTouched] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // A time that was started (some digits typed / picked) but isn't a complete, valid
  // "HH:mm" — surfaced only after the user has left a field so it doesn't flash mid-type.
  const hasInput = hour !== "" || minute !== "";
  const invalid = touched && hasInput && to24h(hour, minute, period) === "";

  function commit(nextHour: string, nextMinute: string, nextPeriod: Period) {
    setHour(nextHour);
    setMinute(nextMinute);
    setPeriod(nextPeriod);
    onChange(to24h(nextHour, nextMinute, nextPeriod));
  }

  // Picking one column in the popover fills a sensible default for anything still empty
  // so a single tap already yields a valid time.
  function pickHour(h: number) {
    commit(String(h), minute === "" ? "00" : minute, period);
  }
  function pickMinute(m: string) {
    commit(hour === "" ? "12" : hour, m, period);
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
          "flex h-9 w-fit items-center gap-1 rounded-lg border border-input bg-background pr-1 pl-2.5 text-sm",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          invalid &&
            "border-destructive focus-within:border-destructive focus-within:ring-destructive/30",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <input
          aria-label={`${label} hour`}
          inputMode="numeric"
          maxLength={2}
          placeholder="--"
          disabled={disabled}
          value={hour}
          onChange={(event) =>
            commit(clampDigits(event.target.value, 2, 12), minute, period)
          }
          onFocus={(event) => event.target.select()}
          onBlur={() => {
            setTouched(true);
            const h = Number(hour);
            if (Number.isInteger(h) && h >= 1 && h <= 12)
              commit(String(h), minute, period);
          }}
          className="w-6 bg-transparent text-center tabular-nums outline-none placeholder:text-muted-foreground"
        />
        <span className="text-muted-foreground">:</span>
        <input
          aria-label={`${label} minute`}
          inputMode="numeric"
          maxLength={2}
          placeholder="--"
          disabled={disabled}
          value={minute}
          onChange={(event) =>
            commit(hour, clampDigits(event.target.value, 2, 59), period)
          }
          onFocus={(event) => event.target.select()}
          onBlur={() => {
            setTouched(true);
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
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <PopoverPrimitive.Root open={pickerOpen} onOpenChange={setPickerOpen}>
          <PopoverPrimitive.Trigger
            aria-label={`Pick ${label.toLowerCase()}`}
            disabled={disabled}
            className="ml-0.5 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Clock className="size-4" />
          </PopoverPrimitive.Trigger>
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Positioner sideOffset={8} align="end">
              <PopoverPrimitive.Popup className="z-50 flex gap-1 rounded-xl border bg-popover bg-clip-padding p-1.5 text-popover-foreground shadow-lg outline-none data-ending-style:opacity-0 data-starting-style:opacity-0">
                <PickerColumn
                  label="Hr"
                  options={PICKER_HOURS.map((h) => ({
                    key: String(h),
                    label: String(h),
                  }))}
                  selected={hour}
                  onSelect={(key) => pickHour(Number(key))}
                />
                <PickerColumn
                  label="Min"
                  options={PICKER_MINUTES.map((m) => ({ key: m, label: m }))}
                  selected={minute}
                  onSelect={pickMinute}
                />
                <PickerColumn
                  label=""
                  options={(["AM", "PM"] as Period[]).map((p) => ({
                    key: p,
                    label: p,
                  }))}
                  selected={period}
                  onSelect={(key) => commit(hour, minute, key as Period)}
                />
              </PopoverPrimitive.Popup>
            </PopoverPrimitive.Positioner>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      </div>
      {invalid && (
        <p className="text-xs text-destructive">Enter a valid time.</p>
      )}
    </div>
  );
}

function PickerColumn({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { key: string; label: string }[];
  selected: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="flex w-12 flex-col">
      {label && (
        <span className="px-1 pb-1 text-center text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
      )}
      <div className="flex max-h-44 flex-col gap-0.5 overflow-y-auto">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={selected === option.key}
            onClick={() => onSelect(option.key)}
            className={cn(
              "rounded-md px-2 py-1 text-center text-sm tabular-nums transition-colors",
              selected === option.key
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
