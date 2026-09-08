import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";
import type {
  StudioSubscriptionSummary,
  StudioSubscriptionTransaction,
  TransactionStatus,
} from "@/features/studio-subscription/types/studio-subscription";

type RawId = { _id?: string; id?: string };

type RawTransaction = RawId & {
  studioId: string;
  subscriptionId: (StudioSubscriptionSummary & RawId) | string;
  amount: number;
  startDate: string;
  expiryDate: string;
  status: string;
  createdAt?: string;
};

// The backend populates `subscriptionId` into the plan sub-document when it's still
// around; it stays a plain string id if the plan was hard-deleted (shouldn't normally
// happen, since plans are soft-deleted, but this keeps the UI from crashing either way).
function normalizeTransaction(raw: RawTransaction): StudioSubscriptionTransaction {
  const rawSubscription = raw.subscriptionId;
  const subscription: StudioSubscriptionSummary | null =
    rawSubscription && typeof rawSubscription === "object"
      ? {
          id: String(rawSubscription.id ?? rawSubscription._id ?? ""),
          title: rawSubscription.title,
          durationInDays: Number(rawSubscription.durationInDays) || 0,
          amount: Number(rawSubscription.amount) || 0,
        }
      : null;

  return {
    ...raw,
    id: String(raw.id ?? raw._id ?? ""),
    subscriptionId: subscription?.id ?? String(rawSubscription ?? ""),
    subscription,
    amount: Number(raw.amount) || 0,
    status: raw.status as TransactionStatus,
  };
}

export async function getStudioSubscriptionTransactions(): Promise<StudioSubscriptionTransaction[]> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/studio-subscription-transactions`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch studio subscription transactions (${res.status})`);
  const transactions: RawTransaction[] = await res.json();
  return transactions.map(normalizeTransaction);
}

// The plan the studio is currently on, if any. `expired`/`cancelled` rows are history.
export async function getCurrentStudioSubscription(): Promise<StudioSubscriptionTransaction | null> {
  const transactions = await getStudioSubscriptionTransactions();
  const active = transactions.find(
    (t) => t.status === "active" && new Date(t.expiryDate).getTime() >= Date.now(),
  );
  return active ?? null;
}
