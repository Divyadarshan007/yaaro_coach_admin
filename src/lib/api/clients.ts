import { redirect } from "next/navigation";

import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import { parseApiError } from "@/lib/api/errors";
import type {
  AdvancedStatsGranularity,
  AdvancedStatsRange,
  ClientAdvancedStats,
} from "@/features/clients/types/advanced-stats";
import type { ClientActivityCalendar } from "@/features/clients/types/activity-calendar";
import type {
  ClientSummary,
  CreateClientInput,
  UpdateClientProfileInput,
} from "@/features/clients/types/client";
import type {
  ClientMeasurement,
  MeasurementInput,
} from "@/features/clients/types/measurement";
import type { FeedItem } from "@/features/clients/types/workout-feed";
import type {
  Program,
  ProgramPatch,
} from "@/features/program-editor/types/program-editor";

// Photos (client avatars, feed media) come back as paths relative to the backend
// (e.g. "/uploads/profile/x.jpg") rather than full URLs. Resolved here — server-side,
// where COACH_BACKEND_URL is allowed — so client components can just use the url as-is.
function resolveMediaUrl(url: string): string {
  return url.startsWith("/") ? `${COACH_BACKEND_URL}${url}` : url;
}

function withResolvedAvatar(summary: ClientSummary): ClientSummary {
  const resolved = summary.avatar ? { ...summary, avatar: resolveMediaUrl(summary.avatar) } : summary;
  return resolved.coach?.avatar
    ? { ...resolved, coach: { ...resolved.coach, avatar: resolveMediaUrl(resolved.coach.avatar) } }
    : resolved;
}

export async function getClients(): Promise<ClientSummary[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  // A coach token whose studio no longer exists comes back as 401 (see
  // middlewares/authenticator.js) — redirect to login instead of throwing into the page render.
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) throw new Error(`Failed to fetch clients (${res.status})`);
  const clients: ClientSummary[] = await res.json();
  return clients.map(withResolvedAvatar);
}

// Manually add a client who doesn't have (or hasn't linked) a Yaaro account yet.
export async function createClient(
  input: CreateClientInput,
): Promise<ClientSummary> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getCoachAuthHeaders()),
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) return parseApiError(res, "Failed to add client");
  return res.json();
}

export async function getClient(id: string): Promise<ClientSummary | null> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${id}`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (res.status === 401) {
    redirect("/login");
  }
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to fetch client ${id} (${res.status})`);
  const client: ClientSummary = await res.json();
  return withResolvedAvatar(client);
}

// Update this client row's own name/phone/gender/lead source. batchId/membershipPlanId
// keep their own dedicated endpoints (assignClientBatch/assignClientMembershipPlan).
export async function updateClientProfile(
  clientId: string,
  patch: UpdateClientProfileInput,
): Promise<ClientSummary> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/profile`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(await getCoachAuthHeaders()),
      },
      body: JSON.stringify(patch),
    },
  );
  if (!res.ok) return parseApiError(res, `Failed to update client ${clientId}`);
  const client: ClientSummary = await res.json();
  return withResolvedAvatar(client);
}

// Detaches this client row from its linked Yaaro app account (userId back to null).
// Name/phone/coachId/batch/program/notes are all untouched — their own "Link now" QR
// becomes valid again for the same or a different person to (re-)link.
export async function unlinkClient(clientId: string): Promise<ClientSummary> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/unlink`,
    {
      method: "PATCH",
      headers: await getCoachAuthHeaders(),
    },
  );
  if (!res.ok) return parseApiError(res, `Failed to unlink client ${clientId}`);
  const client: ClientSummary = await res.json();
  return withResolvedAvatar(client);
}

export async function updateClientNotes(
  clientId: string,
  notes: string,
): Promise<ClientSummary> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${clientId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await getCoachAuthHeaders()),
    },
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) return parseApiError(res, `Failed to update client ${clientId}'s notes`);
  return res.json();
}

export async function removeClient(clientId: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/clients/${clientId}`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) await parseApiError(res, `Failed to remove client ${clientId}`);
}

// Place the client in a batch, or clear it (batchId: null). A full "limited" batch is
// rejected by the backend with a 400 + message.
export async function assignClientBatch(
  clientId: string,
  batchId: string | null,
): Promise<ClientSummary> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/batch`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(await getCoachAuthHeaders()),
      },
      body: JSON.stringify({ batchId }),
    },
  );
  if (!res.ok) return parseApiError(res, "Failed to assign batch");
  return res.json();
}

// Put the client on a membership plan, or clear it (membershipPlanId: null). Assigning
// a different plan (re)starts the membership from today, server-side.
export async function assignClientMembershipPlan(
  clientId: string,
  membershipPlanId: string | null,
): Promise<ClientSummary> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/membership-plan`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(await getCoachAuthHeaders()),
      },
      body: JSON.stringify({ membershipPlanId }),
    },
  );
  if (!res.ok) return parseApiError(res, "Failed to assign membership plan");
  return res.json();
}

export async function reassignClientCoach(
  clientId: string,
  coachId: string,
): Promise<void> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/coach`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(await getCoachAuthHeaders()),
      },
      body: JSON.stringify({ coachId }),
    },
  );
  if (!res.ok) await parseApiError(res, `Failed to reassign client ${clientId}`);
}

export async function assignProgramToClient(
  clientId: string,
  body: { sourceProgramId: string; programStartDate?: string | null },
): Promise<{ id: string; title: string }> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/program`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getCoachAuthHeaders()),
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) return parseApiError(res, `Failed to assign program to client ${clientId}`);
  return res.json();
}

export async function removeClientProgram(clientId: string): Promise<void> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/program`,
    {
      method: "DELETE",
      headers: await getCoachAuthHeaders(),
    },
  );
  if (!res.ok) await parseApiError(res, `Failed to remove client ${clientId}'s program`);
}

export async function getClientProgram(
  clientId: string,
): Promise<Program | null> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/program`,
    {
      cache: "no-store",
      headers: await getCoachAuthHeaders(),
    },
  );
  if (res.status === 401) {
    redirect("/login");
  }
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok)
    throw new Error(
      `Failed to fetch client ${clientId}'s program (${res.status})`,
    );
  const program: Program = await res.json();
  return program.image?.startsWith("/")
    ? { ...program, image: `${COACH_BACKEND_URL}${program.image}` }
    : program;
}

export async function updateClientProgram(
  clientId: string,
  patch: ProgramPatch,
): Promise<Program> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/program`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(await getCoachAuthHeaders()),
      },
      body: JSON.stringify(patch),
    },
  );
  if (!res.ok) return parseApiError(res, `Failed to update client ${clientId}'s program`);
  return res.json();
}

export async function getClientFeeds(
  clientId: string,
  page: number,
): Promise<FeedItem[]> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/feeds/${page}`,
    {
      cache: "no-store",
      headers: await getCoachAuthHeaders(),
    },
  );
  if (res.status === 401) {
    redirect("/login");
  }
  if (res.status === 404 || res.status === 400) return [];
  if (!res.ok)
    throw new Error(
      `Failed to fetch client ${clientId}'s feeds (${res.status})`,
    );
  const feeds: FeedItem[] = await res.json();
  return feeds.map((feed) => ({
    ...feed,
    media: feed.media.map((item) => ({
      ...item,
      url: resolveMediaUrl(item.url),
    })),
  }));
}

// Uploads a single image (e.g. a progress picture) to temp storage, returning its
// resolved URL to be submitted as the `image` field when creating the record that owns it.
export async function uploadClientMeasurementImage(
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.append("images", file);
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/uploads/images`, {
    method: "POST",
    headers: await getCoachAuthHeaders(),
    body: formData,
  });
  if (!res.ok) return parseApiError(res, "Failed to upload image");
  const { images } = (await res.json()) as { images: { url: string }[] };
  return resolveMediaUrl(images[0].url);
}

export async function createClientMeasurement(
  clientId: string,
  body: MeasurementInput,
): Promise<ClientMeasurement> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/measurements`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await getCoachAuthHeaders()),
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) return parseApiError(res, `Failed to log measurement for client ${clientId}`);
  const measurement: ClientMeasurement = await res.json();
  return {
    ...measurement,
    image: measurement.image ? resolveMediaUrl(measurement.image) : "",
  };
}

export async function getClientAdvancedStats(
  clientId: string,
  params: { granularity: AdvancedStatsGranularity; range: AdvancedStatsRange },
): Promise<ClientAdvancedStats | null> {
  const query = new URLSearchParams({
    granularity: params.granularity,
    range: params.range,
  });
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/advanced-stats?${query}`,
    {
      cache: "no-store",
      headers: await getCoachAuthHeaders(),
    },
  );
  if (res.status === 401) {
    redirect("/login");
  }
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok)
    throw new Error(
      `Failed to fetch client ${clientId}'s advanced stats (${res.status})`,
    );
  return res.json();
}

export async function getClientActivityCalendar(
  clientId: string,
  params: { year: number; month: number }, // month is 1-12
): Promise<ClientActivityCalendar | null> {
  const query = new URLSearchParams({
    year: String(params.year),
    month: String(params.month),
  });
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/activity-calendar?${query}`,
    {
      cache: "no-store",
      headers: await getCoachAuthHeaders(),
    },
  );
  if (res.status === 401) {
    redirect("/login");
  }
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok)
    throw new Error(
      `Failed to fetch client ${clientId}'s activity calendar (${res.status})`,
    );
  return res.json();
}

export async function getClientMeasurements(
  clientId: string,
): Promise<ClientMeasurement[]> {
  const res = await fetch(
    `${COACH_BACKEND_URL}/coach/v1/clients/${clientId}/measurements`,
    {
      cache: "no-store",
      headers: await getCoachAuthHeaders(),
    },
  );
  if (res.status === 401) {
    redirect("/login");
  }
  if (res.status === 404 || res.status === 400) return [];
  if (!res.ok)
    throw new Error(
      `Failed to fetch client ${clientId}'s measurements (${res.status})`,
    );
  const measurements: ClientMeasurement[] = await res.json();
  return measurements.map((measurement) => ({
    ...measurement,
    image: measurement.image ? resolveMediaUrl(measurement.image) : "",
  }));
}
