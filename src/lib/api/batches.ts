import { redirect } from "next/navigation";

import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import { parseApiError } from "@/lib/api/errors";
import type {
  Batch,
  CreateBatchInput,
  UpdateBatchInput,
} from "@/features/batch/types/batch";

type RawId = { _id?: string; id?: string };

function normalizeBatch(raw: Batch & RawId): Batch {
  return {
    ...raw,
    id: String(raw.id ?? raw._id ?? ""),
    limitType: raw.limitType === "limited" ? "limited" : "unlimited",
    maxMembers: typeof raw.maxMembers === "number" ? raw.maxMembers : null,
    memberCount: typeof raw.memberCount === "number" ? raw.memberCount : 0,
  };
}

export async function getBatches(): Promise<Batch[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/batches`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  // A coach token whose studio no longer exists comes back as 401 (see
  // middlewares/authenticator.js) — redirect to login instead of throwing into the page render.
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) throw new Error(`Failed to fetch batches (${res.status})`);
  const batches: (Batch & RawId)[] = await res.json();
  return batches.map(normalizeBatch);
}

export async function createBatch(input: CreateBatchInput): Promise<Batch> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/batches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getCoachAuthHeaders()),
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) return parseApiError(res, "Failed to create batch");
  return normalizeBatch(await res.json());
}

export async function updateBatch(
  id: string,
  patch: UpdateBatchInput,
): Promise<Batch> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/batches/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await getCoachAuthHeaders()),
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) return parseApiError(res, "Failed to update batch");
  return normalizeBatch(await res.json());
}

export async function deleteBatch(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/batches/${id}`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) await parseApiError(res, "Failed to delete batch");
}
