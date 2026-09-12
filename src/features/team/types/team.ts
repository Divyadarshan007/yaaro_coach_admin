export type TeamMemberRole = "owner" | "coach" | "admin" | "staff";
export type TeamMemberStatus = "active" | "pending";

export const TEAM_MEMBER_ROLE_LABEL: Record<TeamMemberRole, string> = {
  owner: "Owner",
  coach: "Coach",
  admin: "Admin",
  staff: "Staff",
};

// Roles the owner can assign from the "Add Management" form — never "owner" (a studio
// has exactly one, created at signup).
export const TEAM_MEMBER_ROLE_OPTIONS: { value: TeamMemberRole; label: string }[] = [
  { value: "coach", label: TEAM_MEMBER_ROLE_LABEL.coach },
  { value: "admin", label: TEAM_MEMBER_ROLE_LABEL.admin },
  { value: "staff", label: TEAM_MEMBER_ROLE_LABEL.staff },
];

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
  // Value encoded in this member's own "Link now" QR ("<id>,studioTeam"). Scanning it in
  // the Yaaro app claims this row via POST /mobile/v1/studio/team/:id/joinTeam.
  joinTeamQrValue: string;
};

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

// Times are 24h "HH:mm". id is server-assigned; a slot being added locally has no id yet.
export type TimeSlot = {
  id?: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
};

export type Team = {
  id: string;
  name: string;
  logo: string;
  address: string;
  contactNumber: string;
  timeSlots: TimeSlot[];
  myRole: TeamMemberRole;
  members: TeamMember[];
  // Value encoded in the studio's "add client" QR ("https://yaaro.fit/j/<studioId>").
  // A person scans it in the Yaaro app to request joining as a client.
  joinQrValue: string;
  // Value encoded in the studio's "Add Coach" QR ("https://yaaro.fit/jc/<studioId>").
  // A Yaaro user scans it in the app and is added to the team as an active coach.
  joinCoachQrValue: string;
};

export type TeamPatch = {
  name?: string;
  logo?: string;
  address?: string;
  contactNumber?: string;
  timeSlots?: TimeSlot[];
};

// Payload for "Add Management" (POST /coach/v1/studio/members). No account is required
// up front — this creates a pending, unlinked studio_team row that the actual person
// claims later via that row's own "Link now" QR on the Team page.
export type AddStudioMemberInput = {
  name: string;
  role: TeamMemberRole;
  phone?: string;
};
