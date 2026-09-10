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

// Optional group training slot / membership plan a client is on. Both come straight
// from the backend client response (see ClientSummary) and drive the Clients table
// columns and the row's "Assign batch" / "Assign membership plan" menu items.
export type ClientBatch = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
};

export type ClientMembership = {
  plan: { id: string; title: string };
  // ISO strings. endDate is computed by the backend from the plan's validity.
  startDate: string;
  endDate: string;
  expired: boolean;
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
  batch: ClientBatch | null;
  membership: ClientMembership | null;
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
  // null when the client isn't in a batch / on a plan.
  batch: {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    limitType: "unlimited" | "limited";
    maxMembers: number | null;
  } | null;
  membershipPlan: {
    id: string;
    title: string;
    validity: number;
    validityType: "day" | "month" | "year";
    price: number;
  } | null;
  membershipStartDate: string | null;
  // Computed server-side from membershipStartDate + the plan's validity.
  membershipEndDate: string | null;
  membershipExpired: boolean;
  notes: string;
  createdAt: string;
};

// Payload for POST /coach/v1/clients (manual add — no app account required).
export type CreateClientInput = {
  name: string;
  phone?: string;
  gender?: string;
  sourceId?: string | null;
  // Both optional. Assigning a plan starts the membership from today (server-side).
  batchId?: string | null;
  membershipPlanId?: string | null;
};
