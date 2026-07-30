"use client";

import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

import type { MuscleGroupSetCount } from "@/features/program-editor/types/program-editor";

type SortKey = "muscleGroup" | "sets";
type SortDirection = "asc" | "desc";

export function MuscleSetCountTable({ muscleGroupSetCounts }: { muscleGroupSetCounts: MuscleGroupSetCount[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("muscleGroup");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const rows = useMemo(() => {
    const direction = sortDirection === "asc" ? 1 : -1;
    return [...muscleGroupSetCounts].sort((a, b) => {
      if (sortKey === "muscleGroup") {
        return a.muscleGroup.localeCompare(b.muscleGroup) * direction;
      }
      return (a.sets - b.sets) * direction;
    });
  }, [muscleGroupSetCounts, sortKey, sortDirection]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  function renderSortIcon(column: SortKey) {
    if (column !== sortKey) return <ArrowUpDown className="size-3.5 text-muted-foreground/50" />;
    return sortDirection === "asc" ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-foreground">Set Count Per Muscle Group</h3>
      <div className="max-h-72 overflow-y-auto rounded-lg ring-1 ring-foreground/10">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card">
            <tr className="text-xs text-muted-foreground">
              <th className="px-3 py-2 text-left font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("muscleGroup")}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Muscle Group
                  {renderSortIcon("muscleGroup")}
                </button>
              </th>
              <th className="px-3 py-2 text-right font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("sets")}
                  className="ml-auto flex items-center gap-1 hover:text-foreground"
                >
                  Sets
                  {renderSortIcon("sets")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="px-3 py-2 text-foreground">{row.muscleGroup}</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{row.sets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
