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
  // Whether this client has linked a Yaaro app account yet (userId set on the backend
  // row) — false for a client the coach added by hand who hasn't scanned their QR yet.
  linked: boolean;
  // This row's own "Link now" QR value — scanning it in the Yaaro app attaches the
  // scanning account to this specific client record.
  linkQrValue: string;
};

// A studio_clients row's own "who is this" fields — the source of truth for display,
// whether the client is linked to an app account or was added by hand.
export type ClientSource = { id: string; name: string };

// Shape returned by GET /coach/v1/clients (and the client-list piece of /clients/:id).
export type ClientSummary = {
  id: string;
  // Set once this client has linked (or joined via) a Yaaro app account — null for a
  // manually added client who hasn't linked one yet.
  userId: string | null;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  gender: string;
  source: ClientSource | null;
  linked: boolean;
  linkQrValue: string;
  currentProgram: { id: string; title: string; routineCount?: number } | null;
  programStartDate: string | null;
  notes: string;
  createdAt: string;
};

// Payload for POST /coach/v1/clients (manual add — no app account required).
export type CreateClientInput = {
  name: string;
  phone?: string;
  gender?: string;
  sourceId?: string | null;
};
