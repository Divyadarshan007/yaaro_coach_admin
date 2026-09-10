export type TeamMemberRole = "owner" | "coach" | "admin" | "staff";
export type TeamMemberStatus = "active" | "pending";

export const TEAM_MEMBER_ROLE_LABEL: Record<TeamMemberRole, string> = {
  owner: "Owner",
  coach: "Coach",
  admin: "Admin",
  staff: "Staff",
};

// Roles the owner can assign from the "Add Management" form. Same set as the backend
// STUDIO_TEAM_ROLE enum.
export const TEAM_MEMBER_ROLE_OPTIONS: { value: TeamMemberRole; label: string }[] = [
  { value: "admin", label: TEAM_MEMBER_ROLE_LABEL.admin },
  { value: "coach", label: TEAM_MEMBER_ROLE_LABEL.coach },
  { value: "staff", label: TEAM_MEMBER_ROLE_LABEL.staff },
  { value: "owner", label: TEAM_MEMBER_ROLE_LABEL.owner },
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

// Payload for "Add Management" (POST /coach/v1/studio/members). The person must already
// have a Yaaro account; `password` (optional) sets their coach web-panel login.
export type AddStudioMemberInput = {
  email: string;
  role: TeamMemberRole;
  name?: string;
  phone?: string;
  password?: string;
};
