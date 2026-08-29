// Mirrors the club model in yaaro_backend (src/models/club.js) and the shapes
// returned by the reused mobile club controller (src/routes/mobile/v1/controllers/club_ctrl.js).

export const CLUB_SPORT_TYPES = ["all", "walking", "running", "cycling", "dancing", "workout"] as const;
export type ClubSportType = (typeof CLUB_SPORT_TYPES)[number];

export const CLUB_PURPOSE_TAGS = [
  "just_for_fun",
  "team_or_crew",
  "brand_or_organization",
  "community_or_city",
] as const;
export type ClubPurposeTag = (typeof CLUB_PURPOSE_TAGS)[number];

export type ClubVisibility = "public" | "private";
export type ClubLocationType = "global" | "city";
export type ClubMemberRole = "owner" | "member";
export type ClubMemberStatus = "active" | "pending";

export const CLUB_SPORT_TYPE_LABELS: Record<ClubSportType, string> = {
  all: "All activities",
  walking: "Walking",
  running: "Running",
  cycling: "Cycling",
  dancing: "Dancing",
  workout: "Workout",
};

export const CLUB_PURPOSE_TAG_LABELS: Record<ClubPurposeTag, string> = {
  just_for_fun: "Just for fun",
  team_or_crew: "Team or crew",
  brand_or_organization: "Brand or organization",
  community_or_city: "Community or city",
};

export type ClubLocation = {
  city: string;
  state: string;
  country: string;
  placeId: string;
  lat: number | null;
  lng: number | null;
};

export type Club = {
  id: string;
  title: string;
  description: string;
  sportType: ClubSportType | string;
  purposeTags: string[];
  imageUrl: string;
  coverImageUrl: string;
  visibility: ClubVisibility;
  locationType: ClubLocationType;
  location: ClubLocation;
  memberCount: number;
  createdAt?: string;
  updatedAt?: string;
  isOwner: boolean;
  isMember: boolean;
  myRole: ClubMemberRole | null;
  membershipStatus?: ClubMemberStatus | null;
};

export type ClubMember = {
  id: string;
  userName: string;
  fullName: string;
  profileImage: string;
  role: ClubMemberRole;
  city: string | null;
  state: string | null;
  country: string | null;
};

export type ClubJoinRequest = {
  id: string;
  userName: string;
  fullName: string;
  profileImage: string;
  city: string | null;
  state: string | null;
  country: string | null;
  createdAt: string;
};

export type ClubTab = "own" | "my" | "discover";

export const CLUB_STAT_PERIODS = ["weekly", "monthly", "yearly", "lifetime"] as const;
export type ClubStatPeriod = (typeof CLUB_STAT_PERIODS)[number];

export const CLUB_STAT_PERIOD_LABELS: Record<ClubStatPeriod, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
  lifetime: "Lifetime",
};

// One club-total stat, e.g. { title: "Distance", data: 12400 }. Titles vary by the
// club's sport type (Distance / Time / Volume / Activities), decided by the backend.
export type ClubStatItem = {
  title: string;
  data: number;
};

export type ClubLeaderboardRow = {
  rank: number;
  userId: string;
  userName: string;
  fullName: string;
  profileImage: string;
  isOwner: boolean;
  currentUser: boolean;
  value: number;
};

// The subset of fields the coach create/edit form manages.
export type ClubFormValues = {
  title: string;
  description: string;
  sportType: ClubSportType;
  visibility: ClubVisibility;
  locationType: ClubLocationType;
  location: { city: string; state: string; country: string };
  purposeTags: ClubPurposeTag[];
  imageUrl: string;
  coverImageUrl: string;
};

export type CreateClubInput = {
  title: string;
  description?: string;
  sportType: string;
  purposeTags?: string[];
  imageUrl?: string;
  coverImageUrl?: string;
  visibility: ClubVisibility;
  locationType: ClubLocationType;
  location?: { city?: string; state?: string; country?: string };
};

export type UpdateClubInput = Partial<CreateClubInput>;
