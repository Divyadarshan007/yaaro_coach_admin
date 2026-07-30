"use client";

import { Building2 } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ALL_COACHES = "all";

type ClientsScopeBarProps = {
  coachFilter: string;
  onCoachFilterChange: (value: string) => void;
  coachNames: string[];
};

export function ClientsScopeBar({ coachFilter, onCoachFilterChange, coachNames }: ClientsScopeBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex h-9 items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm font-medium text-foreground">
        <Building2 className="size-4 text-muted-foreground" />
        My Clients
      </div>

      <Select<string>
        value={coachFilter}
        onValueChange={(value) => onCoachFilterChange(value ?? ALL_COACHES)}
      >
        <SelectTrigger className="w-44">
          <SelectValue>{(value: string) => (value === ALL_COACHES ? "All coaches" : value)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_COACHES}>All coaches</SelectItem>
          {coachNames.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { ALL_COACHES };
