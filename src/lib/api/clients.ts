import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type { ClientSummary } from "@/features/clients/types/client";

export async function getClients(): Promise<ClientSummary[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch clients (${res.status})`);
  return res.json();
}

export async function getClient(id: string): Promise<ClientSummary | null> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${id}`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to fetch client ${id} (${res.status})`);
  return res.json();
}

export async function assignProgramToClient(
  clientId: string,
  body: { sourceProgramId: string; programStartDate?: string | null }
): Promise<{ id: string; title: string }> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/program`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to assign program to client ${clientId} (${res.status})`);
  return res.json();
}
