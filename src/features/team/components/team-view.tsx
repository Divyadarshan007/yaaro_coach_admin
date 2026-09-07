import { MembersTab } from "@/features/team/components/members-tab";
import type { Team } from "@/features/team/types/team";

export function TeamView({ team }: { team: Team }) {
  return <MembersTab team={team} />;
}
