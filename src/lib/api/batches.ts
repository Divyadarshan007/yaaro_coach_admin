import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type { Batch, CreateBatchInput, UpdateBatchInput } from "@/features/batch/types/batch";

type RawId = { _id?: string; id?: string };

function normalizeBatch(raw: Batch & RawId): Batch {
  return {
    ...raw,
    id: String(raw.id ?? raw._id ?? ""),
    limitType: raw.limitType === "limited" ? "limited" : "unlimited",
    maxMembers: typeof raw.maxMembers === "number" ? raw.maxMembers : null,
  };
}

async function parseError(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => null);
  throw new Error(body?.message || `${fallback} (${res.status})`);
}

export async function getBatches(): Promise<Batch[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/batches`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch batches (${res.status})`);
  const batches: (Batch & RawId)[] = await res.json();
  return batches.map(normalizeBatch);
}

export async function createBatch(input: CreateBatchInput): Promise<Batch> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/batches`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(input),
  });
  if (!res.ok) return parseError(res, "Failed to create batch");
  return normalizeBatch(await res.json());
}

export async function updateBatch(id: string, patch: UpdateBatchInput): Promise<Batch> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/batches/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(patch),
  });
  if (!res.ok) return parseError(res, "Failed to update batch");
  return normalizeBatch(await res.json());
}

export async function deleteBatch(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/batches/${id}`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) await parseError(res, "Failed to delete batch");
}
