"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export function DatePicker({
  value,
  onChange,
  className,
}: {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
      >
        {value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner sideOffset={6} align="end">
          <PopoverPrimitive.Popup className="z-50 rounded-xl border bg-popover bg-clip-padding text-popover-foreground shadow-lg outline-none data-ending-style:opacity-0 data-starting-style:opacity-0">
            <Calendar
              selected={value}
              onSelect={(date) => {
                onChange(date);
                setOpen(false);
              }}
            />
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
