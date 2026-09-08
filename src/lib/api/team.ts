import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type {
  StudioUserSearchResult,
  Team,
  TeamMember,
  TeamPatch,
} from "@/features/team/types/team";

// Logos come back as backend-relative paths (e.g. "/uploads/studio/x.jpg"), which the
// browser can't load directly — resolve them against COACH_BACKEND_URL here, server-side,
// same as getCoachProfile does for coach avatars.
function resolveLogoUrl(logo: string): string {
  return logo && logo.startsWith("/") ? `${COACH_BACKEND_URL}${logo}` : logo;
}

export async function getTeam(): Promise<Team> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch studio (${res.status})`);
  const team: Team = await res.json();
  return { ...team, logo: resolveLogoUrl(team.logo) };
}

// Uploads a studio logo to temp storage, returning its unresolved path — submit this
// straight back as the `logo` field on updateTeam, which moves it out of temp on save.
export async function uploadTeamLogoImage(file: File): Promise<string> {
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

export async function updateTeam(patch: TeamPatch): Promise<Team> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Failed to update studio (${res.status})`);
  }
  const team: Team = await res.json();
  return { ...team, logo: resolveLogoUrl(team.logo) };
}

// Search app users to invite as coaches (owner only, server-side).
export async function searchStudioUsers(username: string): Promise<StudioUserSearchResult[]> {
  const query = new URLSearchParams({ username }).toString();
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio/members/search?${query}`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Failed to search users (${res.status})`);
  }
  return res.json();
}

// Invite a user (by id, from searchStudioUsers) to join the studio as a coach. The
// backend creates a pending row and pushes an FCM invite; the invitee signs up to accept.
export async function inviteStudioMember(userId: string): Promise<TeamMember> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Failed to invite coach (${res.status})`);
  }
  return res.json();
}

export async function removeTeamMember(memberId: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio/members/${memberId}`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to remove member ${memberId} (${res.status})`);
}
