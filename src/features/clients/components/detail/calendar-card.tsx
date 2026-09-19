"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getClientActivityCalendarAction } from "@/features/clients/actions";
import { cn } from "@/lib/utils";
import { handleMutationError } from "@/lib/handle-mutation-error";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type MonthCell = { date: number; inCurrentMonth: boolean };

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getMonthGrid(year: number, month: number): MonthCell[] {
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: MonthCell[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ date: daysInPrevMonth - i, inCurrentMonth: false });
  }
  for (let date = 1; date <= daysInMonth; date++) {
    cells.push({ date, inCurrentMonth: true });
  }
  let nextMonthDate = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ date: nextMonthDate, inCurrentMonth: false });
    nextMonthDate++;
  }

  return cells;
}

export function CalendarCard({ clientId }: { clientId: string }) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [activeDates, setActiveDates] = useState<Set<string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  useEffect(() => {
    startTransition(async () => {
      setError(null);
      try {
        const result = await getClientActivityCalendarAction(clientId, {
          year,
          month: month + 1,
        });
        setActiveDates(new Set(result?.activeDates ?? []));
      } catch (err) {
        setActiveDates(new Set());
        handleMutationError(err, setError);
      }
    });
  }, [clientId, year, month]);

  const cells = getMonthGrid(year, month);
  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  function goToMonth(delta: number) {
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1),
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Previous month"
          onClick={() => goToMonth(-1)}
        >
          <ChevronLeft />
        </Button>
        <p className="text-sm font-medium text-foreground">{monthLabel}</p>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Next month"
          onClick={() => goToMonth(1)}
        >
          <ChevronRight />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {WEEKDAY_LABELS.map((label, index) => (
            <span key={index} className="py-1">
              {label}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {cells.map((cell, index) => {
            const isToday =
              isCurrentMonth &&
              cell.inCurrentMonth &&
              cell.date === today.getDate();
            const cellDate = cell.inCurrentMonth
              ? new Date(year, month, cell.date)
              : null;
            const isPastOrToday = cellDate ? cellDate <= todayStart : false;
            const isActive =
              cellDate && activeDates
                ? activeDates.has(toDateKey(year, month, cell.date))
                : false;

            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-0.5 py-0.5"
              >
                <span
                  className={cn(
                    "flex aspect-square w-7 items-center justify-center rounded-full",
                    !cell.inCurrentMonth && "text-muted-foreground/40",
                    isToday && "bg-primary font-medium text-primary-foreground",
                  )}
                >
                  {cell.date}
                </span>
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    cell.inCurrentMonth && isPastOrToday && activeDates
                      ? isActive
                        ? "bg-emerald-500"
                        : "bg-destructive/60"
                      : "bg-transparent",
                  )}
                />
              </div>
            );
          })}
        </div>
        {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
