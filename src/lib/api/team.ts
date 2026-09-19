import { redirect } from "next/navigation";

import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import { parseApiError } from "@/lib/api/errors";
import { SUBSCRIPTION_REQUIRED_PREFIX } from "@/lib/subscription-required";
import type {
  AddStudioMemberInput,
  Team,
  TeamMember,
  TeamPatch,
  UpdateStudioMemberInput,
} from "@/features/team/types/team";

// Logos and member avatars come back as backend-relative paths (e.g. "/uploads/studio/x.jpg"),
// which the browser can't load directly — resolve them against COACH_BACKEND_URL here,
// server-side, same as getCoachProfile does for coach avatars.
function resolveUploadUrl(url: string): string {
  return url && url.startsWith("/") ? `${COACH_BACKEND_URL}${url}` : url;
}

function resolveTeam(team: Team): Team {
  return {
    ...team,
    logo: resolveUploadUrl(team.logo),
    members: team.members.map((member) => ({ ...member, avatar: resolveUploadUrl(member.avatar) })),
  };
}

export async function getTeam(): Promise<Team> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  // A coach token whose studio no longer exists comes back as 401 (see
  // middlewares/authenticator.js). getTeam() is called directly at the top of several pages
  // (team, studio, clients) that don't independently check the session — redirect straight
  // to login instead of throwing a raw error into the page render.
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) throw new Error(`Failed to fetch studio (${res.status})`);
  const team: Team = await res.json();
  return resolveTeam(team);
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
  if (!res.ok) return parseApiError(res, "Failed to upload image");
  const { images } = (await res.json()) as { images: { url: string }[] };
  return images[0].url;
}

export async function updateTeam(patch: TeamPatch): Promise<Team> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(patch),
  });
  if (!res.ok) return parseApiError(res, "Failed to update studio");
  const team: Team = await res.json();
  return resolveTeam(team);
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
  if (!res.ok) return parseApiError(res, "Failed to add member");
  return res.json();
}

// Update a member's name/role/phone. Owner only.
export async function updateStudioMember(memberId: string, patch: UpdateStudioMemberInput): Promise<TeamMember> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio/members/${memberId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(patch),
  });
  if (!res.ok) return parseApiError(res, "Failed to update member");
  const member: TeamMember = await res.json();
  return { ...member, avatar: resolveUploadUrl(member.avatar) };
}

// Detaches a member row from its linked Yaaro app account (userId back to null).
// Owner only; the owner's own row can't be unlinked. Role/status/name/phone stay
// untouched — their own "Link now" QR becomes valid again for the same or a different
// person to (re-)link.
export async function unlinkTeamMember(memberId: string): Promise<TeamMember> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio/members/${memberId}/unlink`, {
    method: "PATCH",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) return parseApiError(res, `Failed to unlink member ${memberId}`);
  const member: TeamMember = await res.json();
  return { ...member, avatar: resolveUploadUrl(member.avatar) };
}

export type RemoveTeamMemberResult =
  | { ok: true }
  | { ok: false; requiresReplacement: true; message: string };

// Removing a member who still has clients assigned fails with a 400 carrying
// errors.replacementCoachId instead of throwing — the caller (member-row.tsx) uses that
// to prompt for a replacement coach and retry with `replacementCoachId` set, rather than
// leaving those clients' coachId pointing at a now-deleted member.
export async function removeTeamMember(
  memberId: string,
  replacementCoachId?: string,
): Promise<RemoveTeamMemberResult> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio/members/${memberId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(replacementCoachId ? { replacementCoachId } : {}),
  });
  if (res.ok) return { ok: true };

  const body = await res.json().catch(() => null);
  if (res.status === 400 && body?.errors?.replacementCoachId) {
    return { ok: false, requiresReplacement: true, message: body.message };
  }
  if (body?.code === "SUBSCRIPTION_REQUIRED") {
    throw new Error(SUBSCRIPTION_REQUIRED_PREFIX + body.message);
  }
  const fieldMessages = body?.errors ? Object.values(body.errors as Record<string, string[]>).flat() : [];
  throw new Error(fieldMessages.join(" ") || body?.message || `Failed to remove member ${memberId} (${res.status})`);
}
