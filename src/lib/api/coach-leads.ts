import { redirect } from "next/navigation";

import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import { parseApiError } from "@/lib/api/errors";
import { LEAD_STATUSES } from "@/features/leads/types/lead";
import type {
  CoachLead,
  CoachLeadStatus,
  CreateCoachLeadInput,
  CreateLeadSourceInput,
  LeadSource,
  UpdateCoachLeadInput,
  UpdateLeadSourceInput,
} from "@/features/leads/types/lead";

type RawId = { _id?: string; id?: string };

function normalizeSource(
  raw: (LeadSource & RawId) | null | undefined,
): LeadSource | null {
  if (!raw) return null;
  return { id: String(raw.id ?? raw._id ?? ""), name: raw.name };
}

// The backend `populate("sourceId", "name")`s the source, so `sourceId` comes back
// either as an object (populated), a bare id string, or null.
function normalizeLead(
  raw: CoachLead & RawId & { sourceId?: unknown },
): CoachLead {
  const rawSource = raw.sourceId;
  const isObject = rawSource !== null && typeof rawSource === "object";
  const source = isObject
    ? normalizeSource(rawSource as LeadSource & RawId)
    : null;
  const sourceId = isObject
    ? (source?.id ?? null)
    : typeof rawSource === "string" && rawSource
      ? rawSource
      : null;

  const status = (LEAD_STATUSES as readonly string[]).includes(raw.status)
    ? (raw.status as CoachLeadStatus)
    : "pending";

  return {
    ...raw,
    id: String(raw.id ?? raw._id ?? ""),
    name: raw.name ?? "",
    number: raw.number ?? "",
    gender: raw.gender ?? "",
    sourceId,
    source,
    date: raw.date ?? new Date().toISOString(),
    status,
    notes: raw.notes ?? "",
  };
}

/* ------------------------------- Lead sources ------------------------------ */

export async function getLeadSources(): Promise<LeadSource[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/lead-sources`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  // A coach token whose studio no longer exists comes back as 401 (see
  // middlewares/authenticator.js) — redirect to login instead of throwing into the page render.
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) throw new Error(`Failed to fetch lead sources (${res.status})`);
  const sources: (LeadSource & RawId)[] = await res.json();
  return sources.map((s) => normalizeSource(s)!).filter(Boolean);
}

export async function createLeadSource(
  input: CreateLeadSourceInput,
): Promise<LeadSource> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/lead-sources`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getCoachAuthHeaders()),
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) return parseApiError(res, "Failed to create lead source");
  return normalizeSource(await res.json())!;
}

export async function updateLeadSource(
  id: string,
  patch: UpdateLeadSourceInput,
): Promise<LeadSource> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/lead-sources/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await getCoachAuthHeaders()),
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) return parseApiError(res, "Failed to update lead source");
  return normalizeSource(await res.json())!;
}

export async function deleteLeadSource(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/lead-sources/${id}`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) await parseApiError(res, "Failed to delete lead source");
}

/* ---------------------------------- Leads --------------------------------- */

export async function getCoachLeads(): Promise<CoachLead[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/coach-leads`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  // A coach token whose studio no longer exists comes back as 401 (see
  // middlewares/authenticator.js) — redirect to login instead of throwing into the page render.
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) throw new Error(`Failed to fetch leads (${res.status})`);
  const leads: (CoachLead & RawId)[] = await res.json();
  return leads.map(normalizeLead);
}

export async function createCoachLead(
  input: CreateCoachLeadInput,
): Promise<CoachLead> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/coach-leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getCoachAuthHeaders()),
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) return parseApiError(res, "Failed to create lead");
  return normalizeLead(await res.json());
}

export async function updateCoachLead(
  id: string,
  patch: UpdateCoachLeadInput,
): Promise<CoachLead> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/coach-leads/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await getCoachAuthHeaders()),
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) return parseApiError(res, "Failed to update lead");
  return normalizeLead(await res.json());
}

export async function deleteCoachLead(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/coach-leads/${id}`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) await parseApiError(res, "Failed to delete lead");
}
