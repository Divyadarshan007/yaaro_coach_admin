import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type { AdvancedStatsGranularity, AdvancedStatsRange, ClientAdvancedStats } from "@/features/clients/types/advanced-stats";
import type { ClientSummary } from "@/features/clients/types/client";
import type { ClientMeasurement, MeasurementInput } from "@/features/clients/types/measurement";
import type { FeedItem } from "@/features/clients/types/workout-feed";
import type { Program, ProgramRoutine } from "@/features/program-editor/types/program-editor";

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

export async function updateClientNotes(clientId: string, notes: string): Promise<ClientSummary> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${clientId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) throw new Error(`Failed to update client ${clientId}'s notes (${res.status})`);
  return res.json();
}

export async function removeClient(clientId: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${clientId}`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to remove client ${clientId} (${res.status})`);
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

export async function removeClientProgram(clientId: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/program`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to remove client ${clientId}'s program (${res.status})`);
}

export async function getClientProgram(clientId: string): Promise<Program | null> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/program`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to fetch client ${clientId}'s program (${res.status})`);
  return res.json();
}

export async function updateClientProgram(
  clientId: string,
  patch: Partial<{ title: string; duration: string; note: string; routines: ProgramRoutine[] }>
): Promise<Program> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/program`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Failed to update client ${clientId}'s program (${res.status})`);
  return res.json();
}

// Feed media (photos) come back as paths relative to the backend (e.g. "/uploads/feed/x.jpg")
// rather than full URLs. Resolved here — server-side, where COACH_BACKEND_URL is allowed —
// so the client-rendered feed cards can just use media.url as-is.
function resolveMediaUrl(url: string): string {
  return url.startsWith("/") ? `${COACH_BACKEND_URL}${url}` : url;
}

export async function getClientFeeds(clientId: string, page: number): Promise<FeedItem[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/feeds/${page}`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (res.status === 404 || res.status === 400) return [];
  if (!res.ok) throw new Error(`Failed to fetch client ${clientId}'s feeds (${res.status})`);
  const feeds: FeedItem[] = await res.json();
  return feeds.map((feed) => ({
    ...feed,
    media: feed.media.map((item) => ({ ...item, url: resolveMediaUrl(item.url) })),
  }));
}

// Uploads a single image (e.g. a progress picture) to temp storage, returning its
// resolved URL to be submitted as the `image` field when creating the record that owns it.
export async function uploadClientMeasurementImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("images", file);
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/uploads/images`, {
    method: "POST",
    headers: await getCoachAuthHeaders(),
    body: formData,
  });
  if (!res.ok) throw new Error(`Failed to upload image (${res.status})`);
  const { images } = (await res.json()) as { images: { url: string }[] };
  return resolveMediaUrl(images[0].url);
}

export async function createClientMeasurement(
  clientId: string,
  body: MeasurementInput
): Promise<ClientMeasurement> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/measurements`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to log measurement for client ${clientId} (${res.status})`);
  const measurement: ClientMeasurement = await res.json();
  return { ...measurement, image: measurement.image ? resolveMediaUrl(measurement.image) : "" };
}

export async function getClientAdvancedStats(
  clientId: string,
  params: { granularity: AdvancedStatsGranularity; range: AdvancedStatsRange }
): Promise<ClientAdvancedStats | null> {
  const query = new URLSearchParams({ granularity: params.granularity, range: params.range });
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/advanced-stats?${query}`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to fetch client ${clientId}'s advanced stats (${res.status})`);
  return res.json();
}

export async function getClientMeasurements(clientId: string): Promise<ClientMeasurement[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/measurements`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (res.status === 404 || res.status === 400) return [];
  if (!res.ok) throw new Error(`Failed to fetch client ${clientId}'s measurements (${res.status})`);
  const measurements: ClientMeasurement[] = await res.json();
  return measurements.map((measurement) => ({
    ...measurement,
    image: measurement.image ? resolveMediaUrl(measurement.image) : "",
  }));
}
