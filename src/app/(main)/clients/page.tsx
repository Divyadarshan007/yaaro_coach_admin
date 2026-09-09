import { ClientsView } from "@/features/clients/components/clients-view";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { toClient } from "@/features/clients/lib/to-client";
import { getClients } from "@/lib/api/clients";
import { getCoachProfile } from "@/lib/api/coach";
import { getPrograms } from "@/lib/api/programs";
import { getStudioJoinRequests } from "@/lib/api/studio-join-requests";
import { getTeam } from "@/lib/api/team";

export default async function ClientsPage() {
  const [summaries, coachProfile, libraryPrograms, team, joinRequests] = await Promise.all([
    getClients(),
    getCoachProfile(),
    getPrograms(),
    getTeam(),
    getStudioJoinRequests(),
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
      joinRequests={joinRequests}
      joinQrValue={team.joinQrValue}
      studioName={team.name}
      isOwner={team.myRole === "owner"}
    />
  );
}
