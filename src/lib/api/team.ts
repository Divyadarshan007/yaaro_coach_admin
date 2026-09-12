import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type {
  AddStudioMemberInput,
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

// Add a team member by name/role. Owner only. The backend creates a pending,
// unlinked studio_team row, claimed later via that row's own QR — or, if `email`/
// `password` are included, also sets up a direct yaaro_coach login for them.
export async function addStudioMember(input: AddStudioMemberInput): Promise<TeamMember> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Failed to add member (${res.status})`);
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
