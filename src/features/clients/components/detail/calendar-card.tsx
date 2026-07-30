"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type MonthCell = { date: number; inCurrentMonth: boolean };

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

export function CalendarCard() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const cells = getMonthGrid(viewDate.getFullYear(), viewDate.getMonth());
  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const isCurrentMonth = viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();

  function goToMonth(delta: number) {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <Button variant="ghost" size="icon-sm" aria-label="Previous month" onClick={() => goToMonth(-1)}>
          <ChevronLeft />
        </Button>
        <p className="text-sm font-medium text-foreground">{monthLabel}</p>
        <Button variant="ghost" size="icon-sm" aria-label="Next month" onClick={() => goToMonth(1)}>
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
            const isToday = isCurrentMonth && cell.inCurrentMonth && cell.date === today.getDate();
            return (
              <span
                key={index}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-full",
                  !cell.inCurrentMonth && "text-muted-foreground/40",
                  isToday && "bg-primary font-medium text-primary-foreground"
                )}
              >
                {cell.date}
              </span>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
