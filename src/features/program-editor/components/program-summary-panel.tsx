"use client";

import { ChevronsRight, Hexagon, PersonStanding } from "lucide-react";
import { useMemo, useState } from "react";

import { MuscleDistributionChart } from "@/features/program-editor/components/muscle-distribution-chart";
import { MuscleSetCountTable } from "@/features/program-editor/components/muscle-set-count-table";
import { computeProgramSummary } from "@/features/program-editor/lib/program-summary";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";
import type { Program } from "@/features/program-editor/types/program-editor";
import { useExerciseCatalogStore } from "@/lib/exercise-catalog-store";
import type { MuscleCatalogEntry } from "@/lib/muscle-groups";
import { cn } from "@/lib/utils";

type DistributionView = "chart" | "body";

export function ProgramSummaryPanel({
  program,
  muscleCatalog,
}: {
  program: Program;
  muscleCatalog: MuscleCatalogEntry[];
}) {
  const [distributionView, setDistributionView] = useState<DistributionView>("chart");
  const routines = useMyRoutinesStore((state) => state.routines);
  const exerciseCatalogById = useExerciseCatalogStore((state) => state.byId);
  const programRoutines = program.routineIds
    .map((id) => routines.find((routine) => routine.id === id))
    .filter((routine) => routine !== undefined);
  const summary = useMemo(
    () => computeProgramSummary(programRoutines, exerciseCatalogById, muscleCatalog),
    [programRoutines, exerciseCatalogById, muscleCatalog]
  );

  return (
    <div className="flex h-fit flex-col gap-5 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Summary</h2>
        <button
          type="button"
          aria-label="Collapse summary"
          className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronsRight className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Exercises</span>
          <span className="font-medium text-foreground">{summary.totalExercises}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Sets</span>
          <span className="font-medium text-foreground">{summary.totalSets}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Muscle Distribution</h3>
          <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
            <button
              type="button"
              aria-label="Show radar chart"
              aria-pressed={distributionView === "chart"}
              onClick={() => setDistributionView("chart")}
              className={cn(
                "flex size-6 items-center justify-center rounded-md transition-colors",
                distributionView === "chart"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Hexagon className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Show body view"
              aria-pressed={distributionView === "body"}
              onClick={() => setDistributionView("body")}
              className={cn(
                "flex size-6 items-center justify-center rounded-md transition-colors",
                distributionView === "body"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <PersonStanding className="size-3.5" />
            </button>
          </div>
        </div>

        <MuscleDistributionChart axes={summary.distributionAxes} />
      </div>

      <MuscleSetCountTable muscleGroupSetCounts={summary.muscleGroupSetCounts} />
    </div>
  );
}
