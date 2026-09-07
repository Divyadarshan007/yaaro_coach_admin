"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAYS_OF_WEEK, DAY_LABELS, type DayOfWeek, type TimeSlot } from "@/features/team/types/team";

type AddTimeSlotDialogProps = {
  onAdd: (slot: TimeSlot) => Promise<void>;
};

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
const PERIODS = ["AM", "PM"] as const;

type Period = (typeof PERIODS)[number];

// 12h parts -> 24h "HH:mm"
function to24h(hour12: number, minute: string, period: Period): string {
  let h = hour12 % 12;
  if (period === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

function TimeField({
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

export function AddTimeSlotDialog({ onAdd }: AddTimeSlotDialogProps) {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState<DayOfWeek>("monday");
  const [startHour, setStartHour] = useState(6);
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState<Period>("AM");
  const [endHour, setEndHour] = useState(10);
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState<Period>("PM");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const startTime = to24h(startHour, startMinute, startPeriod);
  const endTime = to24h(endHour, endMinute, endPeriod);
  const isValid = endTime > startTime;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setDay("monday");
      setStartHour(6);
      setStartMinute("00");
      setStartPeriod("AM");
      setEndHour(10);
      setEndMinute("00");
      setEndPeriod("PM");
      setError(null);
    }
  }

  function handleSave() {
    setError(null);
    if (!isValid) {
      setError("End time must be after start time.");
      return;
    }
    startTransition(async () => {
      try {
        await onAdd({ day, startTime, endTime });
        handleOpenChange(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add time slot");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>
        <Plus />
        Add slot
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add time slot</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Day</span>
            <Select<DayOfWeek> value={day} onValueChange={(value) => value && setDay(value)}>
              <SelectTrigger>
                <SelectValue>{(value: DayOfWeek) => DAY_LABELS[value]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((d) => (
                  <SelectItem key={d} value={d}>
                    {DAY_LABELS[d]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TimeField
            label="Start time"
            hour={startHour}
            minute={startMinute}
            period={startPeriod}
            onHour={setStartHour}
            onMinute={setStartMinute}
            onPeriod={setStartPeriod}
          />
          <TimeField
            label="End time"
            hour={endHour}
            minute={endMinute}
            period={endPeriod}
            onHour={setEndHour}
            onMinute={setEndMinute}
            onPeriod={setEndPeriod}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogBody>

        <DialogFooter className="flex-row justify-end">
          <Button size="lg" disabled={!isValid || isPending} onClick={handleSave}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
