import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type {
  CreateMembershipPlanInput,
  MembershipPlan,
  UpdateMembershipPlanInput,
  ValidityType,
} from "@/features/membership-plan/types/membership-plan";

type RawId = { _id?: string; id?: string };

function normalizePlan(raw: MembershipPlan & RawId): MembershipPlan {
  return {
    ...raw,
    id: String(raw.id ?? raw._id ?? ""),
    validity: Number(raw.validity) || 0,
    validityType: (["day", "month", "year"] as ValidityType[]).includes(raw.validityType)
      ? raw.validityType
      : "month",
    price: Number(raw.price) || 0,
  };
}

async function parseError(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => null);
  throw new Error(body?.message || `${fallback} (${res.status})`);
}

export async function getMembershipPlans(): Promise<MembershipPlan[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/membership-plans`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch membership plans (${res.status})`);
  const plans: (MembershipPlan & RawId)[] = await res.json();
  return plans.map(normalizePlan);
}

export async function createMembershipPlan(input: CreateMembershipPlanInput): Promise<MembershipPlan> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/membership-plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(input),
  });
  if (!res.ok) return parseError(res, "Failed to create membership plan");
  return normalizePlan(await res.json());
}

export async function updateMembershipPlan(
  id: string,
  patch: UpdateMembershipPlanInput
): Promise<MembershipPlan> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/membership-plans/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(patch),
  });
  if (!res.ok) return parseError(res, "Failed to update membership plan");
  return normalizePlan(await res.json());
}

export async function deleteMembershipPlan(id: string): Promise<void> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/membership-plans/${id}`, {
    method: "DELETE",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) await parseError(res, "Failed to delete membership plan");
}
