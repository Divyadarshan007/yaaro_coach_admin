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
import { TimeField, to24h, type Period } from "@/features/team/components/time-slot-fields";
import { handleMutationError } from "@/lib/handle-mutation-error";

type AddTimeSlotDialogProps = {
  onAdd: (slot: TimeSlot) => Promise<void>;
};

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
        handleMutationError(err, setError);
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
