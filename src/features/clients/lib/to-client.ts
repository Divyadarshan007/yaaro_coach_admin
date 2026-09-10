import { avatarFromName } from "@/features/clients/lib/avatar";
import { getLastSevenDaysActivity } from "@/features/clients/lib/week-activity";
import type {
  AvatarInfo,
  Client,
  ClientSummary,
} from "@/features/clients/types/client";

// Maps the real ClientSummary (from GET /coach/v1/clients) into the Client shape the
// existing list UI (ClientsTable/ClientsScopeBar/etc.) already renders. weeklyActivity
// and status have no backing data yet (no activity-tracking model exists) — these are
// deliberate placeholders, not real per-client data.
export function toClient(summary: ClientSummary, coach: AvatarInfo): Client {
  return {
    id: summary.id,
    avatar: avatarFromName(
      summary.name || summary.email || "Client",
      summary.id,
    ),
    programName: summary.currentProgram?.title ?? "No program assigned",
    programWeekLabel: undefined,
    weeklyActivity: getLastSevenDaysActivity(new Date(), []),
    status: "active",
    coach,
    linked: summary.linked,
    linkQrValue: summary.linkQrValue,
    batch: summary.batch
      ? {
          id: summary.batch.id,
          title: summary.batch.title,
          startTime: summary.batch.startTime,
          endTime: summary.batch.endTime,
        }
      : null,
    membership:
      summary.membershipPlan &&
      summary.membershipStartDate &&
      summary.membershipEndDate
        ? {
            plan: {
              id: summary.membershipPlan.id,
              title: summary.membershipPlan.title,
            },
            startDate: summary.membershipStartDate,
            endDate: summary.membershipEndDate,
            expired: summary.membershipExpired,
          }
        : null,
  };
}
