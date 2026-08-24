"use client";

import { Search, SearchX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { searchExploreProgramsAction } from "@/features/program-editor/actions";
import {
  PROGRAM_EQUIPMENT_OPTIONS,
  PROGRAM_GOAL_OPTIONS,
  PROGRAM_LEVEL_OPTIONS,
} from "@/features/program-editor/data/program-editor-data";
import type { Program, ProgramEquipment, ProgramGoal, ProgramLevel } from "@/features/program-editor/types/program-editor";
import { ExploreEmptyState } from "@/features/program-library/components/explore-empty-state";
import { ExploreProgramList } from "@/features/program-library/components/explore-program-list";

const ALL = "all";
const SEARCH_DEBOUNCE_MS = 400;

type LevelFilter = ProgramLevel | typeof ALL;
type GoalFilter = ProgramGoal | typeof ALL;
type EquipmentFilter = ProgramEquipment | typeof ALL;

export function ExplorePanel({ initialPrograms }: { initialPrograms: Program[] }) {
  const [programs, setPrograms] = useState(initialPrograms);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<LevelFilter>(ALL);
  const [goal, setGoal] = useState<GoalFilter>(ALL);
  const [equipment, setEquipment] = useState<EquipmentFilter>(ALL);
  const [isPending, setIsPending] = useState(false);

  // Guards against an older, slower request resolving after a newer one and clobbering
  // its results — only the most recently fired request is allowed to update state.
  const latestRequestId = useRef(0);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const requestId = ++latestRequestId.current;
    setIsPending(true);
    const timer = setTimeout(() => {
      searchExploreProgramsAction({
        search: search.trim() || undefined,
        level: level === ALL ? undefined : level,
        goal: goal === ALL ? undefined : goal,
        equipment: equipment === ALL ? undefined : equipment,
      })
        .then((results) => {
          if (requestId === latestRequestId.current) setPrograms(results);
        })
        .finally(() => {
          if (requestId === latestRequestId.current) setIsPending(false);
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search, level, goal, equipment]);

  const hasActiveFilters = search.trim() !== "" || level !== ALL || goal !== ALL || equipment !== ALL;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-sm sm:flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search programs"
            className="h-9 w-full pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            items={[{ value: ALL, label: "All Levels" }, ...PROGRAM_LEVEL_OPTIONS]}
            value={level}
            onValueChange={(value) => setLevel(value as LevelFilter)}
          >
            <SelectTrigger className="h-9 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Levels</SelectItem>
              {PROGRAM_LEVEL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={[{ value: ALL, label: "All Goals" }, ...PROGRAM_GOAL_OPTIONS]}
            value={goal}
            onValueChange={(value) => setGoal(value as GoalFilter)}
          >
            <SelectTrigger className="h-9 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Goals</SelectItem>
              {PROGRAM_GOAL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={[{ value: ALL, label: "All Equipment" }, ...PROGRAM_EQUIPMENT_OPTIONS]}
            value={equipment}
            onValueChange={(value) => setEquipment(value as EquipmentFilter)}
          >
            <SelectTrigger className="h-9 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Equipment</SelectItem>
              {PROGRAM_EQUIPMENT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={isPending ? "opacity-60 transition-opacity" : "transition-opacity"}>
        {programs.length > 0 ? (
          <ExploreProgramList programs={programs} />
        ) : hasActiveFilters ? (
          <EmptyState
            className="min-h-105 justify-center rounded-xl bg-card ring-1 ring-foreground/10"
            icon={SearchX}
            title="No Matching Programs"
            description="Try a different search term or clear a filter."
          />
        ) : (
          <ExploreEmptyState />
        )}
      </div>
    </div>
  );
}
