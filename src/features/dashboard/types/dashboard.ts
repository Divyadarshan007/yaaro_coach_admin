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

export type DashboardStats = {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  weeklyActiveClients: WeeklyActiveClients;
  upcomingBirthdays: UpcomingBirthday[];
};
