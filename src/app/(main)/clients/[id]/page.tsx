import { notFound } from "next/navigation";

import { ClientDetailView } from "@/features/clients/components/detail/client-detail-view";
import { getClientDetailMockStats } from "@/features/clients/data/client-detail-mock-data";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { buildBodyweightSummary, buildOverviewStats, buildProgressPictures } from "@/features/clients/lib/overview-stats-format";
import type { ClientDetail } from "@/features/clients/types/client-detail";
import { getClient, getClientAdvancedStats, getClientFeeds, getClientMeasurements, getClientProgram } from "@/lib/api/clients";
import { getCoachProfile } from "@/lib/api/coach";
import { getExerciseCatalog } from "@/lib/api/exercises";
import { getPrograms } from "@/lib/api/programs";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [summary, coachProfile, libraryPrograms, activeProgram, initialFeeds, exerciseCatalog, initialMeasurements, advancedStats] =
    await Promise.all([
      getClient(id),
      getCoachProfile(),
      getPrograms(),
      getClientProgram(id),
      getClientFeeds(id, 1),
      getExerciseCatalog(),
      getClientMeasurements(id),
      getClientAdvancedStats(id, { granularity: "week", range: "1m" }),
    ]);

  if (!summary) {
    notFound();
  }

  const coachAvatar = avatarFromName(coachProfile?.name || coachProfile?.email || "Coach", coachProfile?.id ?? "coach");
  // Real workout-log/measurement data (weekly duration+volume+sets, bodyweight, progress
  // pictures) — only "activities" still falls back to the mock, which is empty for real
  // clients anyway since no activity-feed model exists yet.
  const { activities } = getClientDetailMockStats(id);

  const client: ClientDetail = {
    id: summary.id,
    avatar: avatarFromName(summary.name || summary.email || "Client", summary.id),
    name: summary.name,
    email: summary.email,
    coach: coachAvatar,
    coachedSinceLabel: `Coached since ${new Date(summary.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`,
    coachedSince: summary.createdAt,
    notes: summary.notes,
    workoutProgram: summary.currentProgram
      ? {
          id: summary.currentProgram.id,
          name: summary.currentProgram.title,
          routineCount: summary.currentProgram.routineCount ?? 0,
          programStartDate: summary.programStartDate,
        }
      : null,
    activities,
    ...buildOverviewStats(advancedStats),
    bodyweight: buildBodyweightSummary(initialMeasurements),
    progressPictures: buildProgressPictures(initialMeasurements),
  };

  return (
    <ClientDetailView
      client={client}
      libraryPrograms={libraryPrograms}
      activeProgram={activeProgram}
      initialFeeds={initialFeeds}
      exerciseCatalog={exerciseCatalog}
      initialMeasurements={initialMeasurements}
    />
  );
}
