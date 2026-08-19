import { ClientsView } from "@/features/clients/components/clients-view";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { toClient } from "@/features/clients/lib/to-client";
import { getClients } from "@/lib/api/clients";
import { getCoachProfile } from "@/lib/api/coach";
import { getPrograms } from "@/lib/api/programs";
import { getTeam } from "@/lib/api/team";

export default async function ClientsPage() {
  const [summaries, coachProfile, libraryPrograms, team] = await Promise.all([
    getClients(),
    getCoachProfile(),
    getPrograms(),
    getTeam(),
  ]);
  const coachAvatar = avatarFromName(coachProfile?.name || coachProfile?.email || "Coach", coachProfile?.id ?? "coach");
  const clients = summaries.map((summary) => toClient(summary, coachAvatar));
  // Only other active teammates can be reassigned to — see clients/[id]/page.tsx for the same rule.
  const reassignableTeamMembers = team.members.filter((member) => member.status === "active" && !member.isMe);

  return (
    <ClientsView
      clients={clients}
      coachSlug={coachProfile?.slug ?? ""}
      libraryPrograms={libraryPrograms}
      teamMembers={reassignableTeamMembers}
    />
  );
}
