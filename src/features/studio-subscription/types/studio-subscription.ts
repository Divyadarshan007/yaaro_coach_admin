// Mirrors the studioSubscription / studioSubscriptionTransaction models in yaaro_backend
// (src/models/studio_subscription.js, src/models/studio_subscription_transaction.js).
// Plans are created and assigned to studios by admins only — a coach can only read
// their studio's subscription history via GET /coach/v1/studio-subscription-transactions.

export const TRANSACTION_STATUSES = ["active", "expired", "cancelled"] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  active: "Active",
  expired: "Expired",
  cancelled: "Cancelled",
};

// A summary of the plan a transaction was taken against, snapshotted from the
// populated `subscriptionId` field — the plan itself may since have changed or been deleted.
export type StudioSubscriptionSummary = {
  id: string;
  title: string;
  durationInDays: number;
  amount: number;
};

export type StudioSubscriptionTransaction = {
  id: string;
  studioId: string;
  subscriptionId: string;
  subscription: StudioSubscriptionSummary | null;
  amount: number;
  startDate: string;
  expiryDate: string;
  status: TransactionStatus;
  createdAt?: string;
};
