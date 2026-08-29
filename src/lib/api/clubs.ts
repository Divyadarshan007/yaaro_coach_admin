import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type {
  Club,
  ClubJoinRequest,
  ClubLeaderboardRow,
  ClubMember,
  ClubStatItem,
  ClubStatPeriod,
  ClubTab,
  CreateClubInput,
  UpdateClubInput,
} from "@/features/clubs/types/club";

// Club images and member avatars come back as backend-relative paths
// (e.g. "/uploads/club/x.jpg"), which the browser can't load directly — resolve them
// against COACH_BACKEND_URL here, server-side, same as team.ts does for team logos.
function resolveUploadUrl(url: string): string {
  return url && url.startsWith("/") ? `${COACH_BACKEND_URL}${url}` : url;
}

// Inverse of resolveUploadUrl — the backend stores image paths relative
// (e.g. "/uploads/club/x.jpg"). An unchanged image round-trips through the form as
// the resolved absolute URL, so strip the origin back off before writing, otherwise
// updateClub would persist an absolute URL. Freshly uploaded temp paths and
// external URLs are left untouched.
function unresolveUploadUrl(url: string): string {
  return url && url.startsWith(`${COACH_BACKEND_URL}/`) ? url.slice(COACH_BACKEND_URL.length) : url;
}

function withUnresolvedImages<T extends { imageUrl?: string; coverImageUrl?: string }>(input: T): T {
  const out = { ...input };
  if (out.imageUrl !== undefined) out.imageUrl = unresolveUploadUrl(out.imageUrl);
  if (out.coverImageUrl !== undefined) out.coverImageUrl = unresolveUploadUrl(out.coverImageUrl);
  return out;
}

// The mobile controller returns `_id` on some responses and an explicit `id` on
// others — normalise to a single `id` string for the frontend.
type RawId = { _id?: string; id?: string };
function pickId(raw: RawId): string {
  return String(raw.id ?? raw._id ?? "");
}

function normalizeClub(raw: Club & RawId): Club {
  return {
    ...raw,
    id: pickId(raw),
    imageUrl: resolveUploadUrl(raw.imageUrl || ""),
    coverImageUrl: resolveUploadUrl(raw.coverImageUrl || ""),
    purposeTags: Array.isArray(raw.purposeTags) ? raw.purposeTags : [],
    location: {
      city: raw.location?.city || "",
      state: raw.location?.state || "",
      country: raw.location?.country || "",
      placeId: raw.location?.placeId || "",
      lat: raw.location?.lat ?? null,
      lng: raw.location?.lng ?? null,
    },
    isOwner: Boolean(raw.isOwner),
    isMember: Boolean(raw.isMember),
    myRole: raw.myRole ?? null,
  };
}

function normalizePerson<T extends RawId & { profileImage?: string }>(raw: T) {
  return {
    ...raw,
    id: pickId(raw),
    profileImage: resolveUploadUrl(raw.profileImage || ""),
  };
}

async function parseError(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => null);
  throw new Error(body?.message || `${fallback} (${res.status})`);
}

export async function getClubs(tab: ClubTab, search?: string): Promise<Club[]> {
  const params = new URLSearchParams({ tab });
  if (search?.trim()) params.set("search", search.trim());

  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clubs?${params.toString()}`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch clubs (${res.status})`);
  const clubs: (Club & RawId)[] = await res.json();
  return clubs.map(normalizeClub);
}

export async function getClub(id: string): Promise<Club | null> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clubs/${id}`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to fetch club ${id} (${res.status})`);
  return normalizeClub(await res.json());
}

export async function createClub(input: CreateClubInput): Promise<Club> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clubs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(withUnresolvedImages(input)),
  });
  if (!res.ok) return parseError(res, "Failed to create club");
  return normalizeClub(await res.json());
}

export async function updateClub(id: string, patch: UpdateClubInput): Promise<Club> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clubs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(withUnresolvedImages(patch)),
  });
  if (!res.ok) return parseError(res, "Failed to update club");
  return normalizeClub(await res.json());
}

export async function deleteClub(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clubs/${id}`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) await parseError(res, "Failed to delete club");
}

export async function getClubMembers(id: string): Promise<ClubMember[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clubs/${id}/members`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch club members (${res.status})`);
  const members: (ClubMember & RawId)[] = await res.json();
  return members.map(normalizePerson);
}

export async function getClubJoinRequests(id: string): Promise<ClubJoinRequest[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clubs/${id}/joinRequests`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch join requests (${res.status})`);
  const requests: (ClubJoinRequest & RawId)[] = await res.json();
  return requests.map(normalizePerson);
}

export async function getClubStats(id: string, period: ClubStatPeriod): Promise<ClubStatItem[]> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clubs/${id}/stats/weekly?period=${period}`,
    { cache: "no-store", headers: await getCoachAuthHeaders() }
  );
  if (!res.ok) throw new Error(`Failed to fetch club stats (${res.status})`);
  const body = (await res.json()) as { club?: ClubStatItem[] };
  return Array.isArray(body?.club) ? body.club : [];
}

export async function getClubLeaderboard(
  id: string,
  period: ClubStatPeriod
): Promise<ClubLeaderboardRow[]> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clubs/${id}/leaderboard?period=${period}&limit=50`,
    { cache: "no-store", headers: await getCoachAuthHeaders() }
  );
  if (!res.ok) throw new Error(`Failed to fetch club leaderboard (${res.status})`);
  const rows = (await res.json()) as ClubLeaderboardRow[];
  return rows.map((row) => ({ ...row, profileImage: resolveUploadUrl(row.profileImage || "") }));
}

export async function approveClubJoinRequest(id: string, userId: string): Promise<void> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clubs/${id}/joinRequests/${userId}/approve`,
    { method: "POST", headers: await getCoachAuthHeaders() }
  );
  if (!res.ok) await parseError(res, "Failed to approve request");
}

export async function rejectClubJoinRequest(id: string, userId: string): Promise<void> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clubs/${id}/joinRequests/${userId}/reject`,
    { method: "POST", headers: await getCoachAuthHeaders() }
  );
  if (!res.ok) await parseError(res, "Failed to reject request");
}

export async function joinClub(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clubs/${id}/join`, {
    method: "POST",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) await parseError(res, "Failed to join club");
}

export async function leaveClub(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clubs/${id}/leave`, {
    method: "POST",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) await parseError(res, "Failed to leave club");
}

// Uploads a club image/cover to temp storage, returning its unresolved "/uploads/temp/..."
// path — submit that straight back as imageUrl/coverImageUrl on create/update, which
// moves it out of temp on save (same flow as team logos and coach avatars).
export async function uploadClubImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("images", file);
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/uploads/images`, {
    method: "POST",
    headers: await getCoachAuthHeaders(),
    body: formData,
  });
  if (!res.ok) throw new Error(`Failed to upload image (${res.status})`);
  const { images } = (await res.json()) as { images: { url: string }[] };
  return images[0].url;
}
