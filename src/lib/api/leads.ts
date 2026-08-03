import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type { Lead, LeadStatus, PublicCoach } from "@/features/grow/types/grow";

export async function getLeads(): Promise<Lead[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/leads`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch leads (${res.status})`);
  return res.json();
}

export async function getPendingLeadsCount(): Promise<number> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/leads/pending-count`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) return 0;
  const { count } = (await res.json()) as { count: number };
  return count;
}

export async function updateLeadStatus(id: string, status: Extract<LeadStatus, "invited" | "declined">): Promise<Lead> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Failed to update lead ${id} (${res.status})`);
  return res.json();
}

// Public endpoints — no coach auth, called from the public /[slug]/join page.
export async function getPublicCoachBySlug(slug: string): Promise<PublicCoach | null> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/public/coaches/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch coach ${slug} (${res.status})`);
  return res.json();
}

export async function submitPublicLead(
  slug: string,
  body: { name: string; email: string; message: string; acceptedTerms: boolean }
): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/public/coaches/${slug}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to submit lead (${res.status})`);
}
