"use client";

import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAYS_OF_WEEK, DAY_LABELS, type DayOfWeek, type TimeSlot } from "@/features/team/types/team";
import { TimeField, from24h, to24h, type Period } from "@/features/team/components/time-slot-fields";

type EditTimeSlotDialogProps = {
  slot: TimeSlot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (slot: TimeSlot) => Promise<void>;
};

export function EditTimeSlotDialog({ slot, open, onOpenChange, onSave }: EditTimeSlotDialogProps) {
  const [day, setDay] = useState<DayOfWeek>("monday");
  const [startHour, setStartHour] = useState(6);
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState<Period>("AM");
  const [endHour, setEndHour] = useState(10);
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState<Period>("PM");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reset the form fields from the slot being edited each time the dialog opens.
  useEffect(() => {
    if (!open || !slot) return;
    setDay(slot.day);
    const start = from24h(slot.startTime);
    setStartHour(start.hour);
    setStartMinute(start.minute);
    setStartPeriod(start.period);
    const end = from24h(slot.endTime);
    setEndHour(end.hour);
    setEndMinute(end.minute);
    setEndPeriod(end.period);
    setError(null);
  }, [open, slot]);

  const startTime = to24h(startHour, startMinute, startPeriod);
  const endTime = to24h(endHour, endMinute, endPeriod);
  const isValid = endTime > startTime;

  function handleSave() {
    if (!slot) return;
    setError(null);
    if (!isValid) {
      setError("End time must be after start time.");
      return;
    }
    startTransition(async () => {
      try {
        await onSave({ ...slot, day, startTime, endTime });
        onOpenChange(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update time slot");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit time slot</DialogTitle>
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
          <Button variant="outline" size="lg" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button size="lg" disabled={!isValid || isPending} onClick={handleSave}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
