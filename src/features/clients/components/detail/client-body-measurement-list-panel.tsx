"use client";

import { Ruler, Search, User } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { MEASUREMENT_FIELDS, type MeasurementFieldKey } from "@/features/clients/lib/measurement-fields";
import { cn } from "@/lib/utils";

// Body Weight pinned first, everything else alphabetical — matches the reference list order.
const ORDERED_FIELDS = [
  MEASUREMENT_FIELDS[0],
  ...MEASUREMENT_FIELDS.slice(1).sort((a, b) => a.label.localeCompare(b.label)),
];

export function ClientBodyMeasurementListPanel({
  selectedKey,
  onSelect,
}: {
  selectedKey: MeasurementFieldKey;
  onSelect: (key: MeasurementFieldKey) => void;
}) {
  const [search, setSearch] = useState("");

  const filteredFields = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return ORDERED_FIELDS;
    return ORDERED_FIELDS.filter((field) => field.label.toLowerCase().includes(query));
  }, [search]);

  return (
    <div className="flex h-full flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search measurements"
          className="h-9 pl-9"
        />
      </div>

      <div className="flex max-h-[calc(100vh-20rem)] flex-col gap-1 overflow-y-auto">
        {filteredFields.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">No measurements found.</p>
        )}
        {filteredFields.map((field) => {
          const Icon = field.key === "weight" || field.key === "bodyFat" ? User : Ruler;
          return (
            <button
              key={field.key}
              type="button"
              onClick={() => onSelect(field.key)}
              className={cn(
                "flex items-center gap-3 rounded-lg p-2 text-left text-sm font-medium text-foreground hover:bg-muted/50",
                selectedKey === field.key && "bg-muted"
              )}
            >
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              {field.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
