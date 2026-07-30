export type WeekDayActivity = {
  key: string;
  dayLabel: string;
  dayNumber: number;
  active: boolean;
};

export type ClientStatus = "active" | "sample";

export type AvatarInfo = {
  name: string;
  initials: string;
  colorClassName: string;
};

export type Client = {
  id: string;
  avatar: AvatarInfo;
  programName: string;
  programWeekLabel?: string;
  weeklyActivity: WeekDayActivity[];
  status: ClientStatus;
  coach: AvatarInfo;
};

// Shape returned by GET /coach/v1/clients (and the client-list piece of /clients/:id).
export type ClientSummary = {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  currentProgram: { id: string; title: string; routineCount?: number } | null;
  programStartDate: string | null;
  createdAt: string;
};
