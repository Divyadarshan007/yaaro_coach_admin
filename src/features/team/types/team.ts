export type TeamMemberRole = "owner" | "member";
export type TeamMemberStatus = "active" | "pending";

export type TeamMember = {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  avatar: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  clientCount: number;
  isMe: boolean;
};

export type Team = {
  id: string;
  name: string;
  logo: string;
  myRole: TeamMemberRole;
  members: TeamMember[];
};

export type InvitedTeamMember = TeamMember & { inviteToken: string };
