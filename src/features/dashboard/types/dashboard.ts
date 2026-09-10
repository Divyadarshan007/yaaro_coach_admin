export type StatCardData = {
  id: string;
  title: string;
  value: number;
  href: string;
};

export type WeeklyActiveClientWeek = {
  weekStart: string;
  weekEnd: string;
  count: number;
};

export type WeeklyActiveClients = {
  totalClients: number;
  weeks: WeeklyActiveClientWeek[];
};

export type UpcomingBirthday = {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  dob: string;
  nextBirthdayDate: string;
  daysUntil: number;
  turningAge: number;
};

// A client who hasn't checked in today. `lastCheckInAt` is null for a client who has
// never checked in (or isn't linked to an app account yet). The list is sorted by
// last check-in, most recent first, "never" last.
export type AbsentMember = {
  id: string;
  userId: string | null;
  name: string;
  avatar: string;
  lastCheckInAt: string | null; // ISO
};

// A client whose membership expires within the next 30 days (and hasn't expired yet).
export type Renewal = {
  id: string;
  userId: string | null;
  name: string;
  avatar: string;
  planTitle: string;
  expiryDate: string; // ISO
  daysUntilExpiry: number;
};

export type DashboardStats = {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  weeklyActiveClients: WeeklyActiveClients;
  upcomingBirthdays: UpcomingBirthday[];
  absentMembers: AbsentMember[];
  renewals: Renewal[];
};
