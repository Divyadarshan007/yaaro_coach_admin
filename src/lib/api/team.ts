import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type { InvitedTeamMember, Team } from "@/features/team/types/team";

export async function getTeam(): Promise<Team> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/team`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch team (${res.status})`);
  return res.json();
}

export async function updateTeam(patch: { name?: string; logo?: string }): Promise<Team> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/team`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Failed to update team (${res.status})`);
  }
  return res.json();
}

export async function inviteTeamMember(email: string): Promise<InvitedTeamMember> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/team/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Failed to invite team member (${res.status})`);
  }
  return res.json();
}

export async function removeTeamMember(memberId: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/team/members/${memberId}`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to remove team member ${memberId} (${res.status})`);
}

export async function acceptTeamInvite(token: string): Promise<{ teamId: string }> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/team/invites/${token}/accept`, {
    method: "POST",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to accept team invite (${res.status})`);
  return res.json();
}
