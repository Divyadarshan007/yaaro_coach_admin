import { TeamView } from "@/features/team/components/team-view";
import { getTeam } from "@/lib/api/team";

export default async function TeamPage() {
  const team = await getTeam();

  return <TeamView team={team} />;
}
