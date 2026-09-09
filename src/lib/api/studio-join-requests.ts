import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";

// A pending "add me as a client" request, created when an app user scans the studio's
// join QR in the Yaaro mobile app (POST /mobile/v1/studios/:id/join).
export type StudioJoinRequest = {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  avatar: string;
  requestedAt: string;
};

export async function getStudioJoinRequests(): Promise<StudioJoinRequest[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio/join-requests`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  // Only the studio owner can review requests — non-owners get 403, treated as "none".
  if (res.status === 403) return [];
  if (!res.ok) throw new Error(`Failed to fetch join requests (${res.status})`);
  return res.json();
}

export async function approveStudioJoinRequest(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio/join-requests/${id}/approve`, {
    method: "POST",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Failed to approve request (${res.status})`);
  }
}

export async function rejectStudioJoinRequest(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio/join-requests/${id}/reject`, {
    method: "POST",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Failed to reject request (${res.status})`);
  }
}
