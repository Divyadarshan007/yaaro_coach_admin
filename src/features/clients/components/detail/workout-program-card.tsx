"use client";

import { CalendarRange } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgramActionsMenu } from "@/features/clients/components/detail/program-actions-menu";
import type { ClientDetail } from "@/features/clients/types/client-detail";
import type { Program } from "@/features/program-editor/types/program-editor";

export function WorkoutProgramCard({
  client,
  libraryPrograms,
}: {
  client: ClientDetail;
  libraryPrograms: Program[];
}) {
  const { workoutProgram } = client;

  if (!workoutProgram) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workout Program</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No program assigned yet.</p>
        </CardContent>
      </Card>
    );
  }

  const isScheduled = workoutProgram.programStartDate
    ? new Date(workoutProgram.programStartDate) > new Date()
    : false;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Workout Program</CardTitle>
        <div className="flex items-center gap-3">
          <Link href={`/clients/${client.id}/program`} className="text-sm text-primary hover:underline">
            Edit program
          </Link>
          <ProgramActionsMenu client={client} libraryPrograms={libraryPrograms} programName={workoutProgram.name} />
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <CalendarRange className="size-5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="wrap-break-word text-sm font-medium text-foreground">{workoutProgram.name}</p>
          <p className="text-sm text-muted-foreground">
            {isScheduled
              ? `Starts on ${new Date(workoutProgram.programStartDate!).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`
              : `${workoutProgram.routineCount} routines`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
