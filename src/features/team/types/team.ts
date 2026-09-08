export type TeamMemberRole = "owner" | "coach";
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
};

export type TeamPatch = {
  name?: string;
  logo?: string;
  address?: string;
  contactNumber?: string;
  timeSlots?: TimeSlot[];
};

// A user returned by the coach-invite search (GET /coach/v1/studio/members/search).
export type StudioUserSearchResult = {
  userId: string;
  userName: string;
  name: string;
  avatar: string;
};
