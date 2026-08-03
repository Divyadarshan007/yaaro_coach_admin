import { CalendarRange } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ProgramActionsMenu } from "@/features/clients/components/detail/program-actions-menu";
import type { ClientDetail } from "@/features/clients/types/client-detail";
import type { Program, ProgramRoutine } from "@/features/program-editor/types/program-editor";

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function totalWeeksFromDuration(duration: string): number | null {
  const match = duration.match(/^(\d+)-weeks$/);
  return match ? Number(match[1]) : null;
}

function computeWeekLabel(duration: string, programStartDate: string | null): string | null {
  if (programStartDate && new Date(programStartDate) > new Date()) {
    return `Starts on ${new Date(programStartDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }

  const totalWeeks = totalWeeksFromDuration(duration);
  if (!totalWeeks) return null;

  const start = programStartDate ? new Date(programStartDate).getTime() : Date.now();
  const elapsedWeeks = Math.floor((Date.now() - start) / MS_PER_WEEK) + 1;
  const currentWeek = Math.min(Math.max(elapsedWeeks, 1), totalWeeks);
  return `Week ${currentWeek} out of ${totalWeeks}`;
}

function routineSummary(routine: ProgramRoutine): string {
  return routine.exercises
    .map((exercise) => `${exercise.sets.length} × ${exercise.name}`)
    .join(", ");
}

export function ActiveProgramPanel({
  client,
  libraryPrograms,
  activeProgram,
}: {
  client: ClientDetail;
  libraryPrograms: Program[];
  activeProgram: Program | null;
}) {
  const { workoutProgram } = client;

  if (!workoutProgram || !activeProgram) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-medium text-foreground">Active Program</h2>
        <Card>
          <CardContent>
            <EmptyState
              icon={CalendarRange}
              title="No program assigned"
              description="Assign a workout program to this client to see it here."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const weekLabel = computeWeekLabel(activeProgram.duration, workoutProgram.programStartDate);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-medium text-foreground">Active Program</h2>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="min-w-0">
            <CardTitle className="wrap-break-word">{activeProgram.title}</CardTitle>
            {weekLabel && <p className="text-sm text-muted-foreground">{weekLabel}</p>}
          </div>
          <ProgramActionsMenu client={client} libraryPrograms={libraryPrograms} programName={activeProgram.title} />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {activeProgram.routines.map((routine) => (
            <div key={routine.id} className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">{routine.name}</p>
              <p className="text-sm text-muted-foreground">{routineSummary(routine)}</p>
            </div>
          ))}
        </CardContent>
        <div className="flex justify-end px-4">
          <Button size="sm" nativeButton={false} render={<Link href={`/clients/${client.id}/program`} />}>
            Edit Program
          </Button>
        </div>
      </Card>
    </div>
  );
}
