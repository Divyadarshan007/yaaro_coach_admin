import { CircleAlert, Wallet } from "lucide-react";

import { StudioSubscriptionStatusBadge } from "@/features/studio-subscription/components/studio-subscription-status-badge";
import { daysUntil, formatDate, formatDuration } from "@/features/studio-subscription/lib/format";
import type { StudioSubscriptionTransaction } from "@/features/studio-subscription/types/studio-subscription";

// A plan this close to its expiry date (and still active) gets a "renew soon" nudge.
const EXPIRY_WARNING_WINDOW_DAYS = 15;

function formatDaysLeft(days: number): string {
  if (days <= 0) return "today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

// Read-only. Coaches can't create or take plans — an admin assigns one to the studio.
export function CurrentSubscriptionCard({
  subscription,
}: {
  subscription: StudioSubscriptionTransaction | null;
}) {
  const daysRemaining = subscription ? daysUntil(subscription.expiryDate) : null;
  const isExpiringSoon =
    subscription?.status === "active" &&
    daysRemaining !== null &&
    daysRemaining >= 0 &&
    daysRemaining <= EXPIRY_WARNING_WINDOW_DAYS;

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-foreground">Studio subscription</h2>
        </div>
        {subscription && <StudioSubscriptionStatusBadge status={subscription.status} />}
      </div>

      {subscription ? (
        <>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">Plan</dt>
              <dd className="font-medium text-foreground">{subscription.subscription?.title ?? "—"}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">Started</dt>
              <dd className="text-foreground">{formatDate(subscription.startDate)}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">Expires</dt>
              <dd className="text-foreground">
                {formatDate(subscription.expiryDate)}
                {subscription.subscription
                  ? ` · ${formatDuration(subscription.subscription.durationInDays)}`
                  : ""}
              </dd>
            </div>
          </dl>

          {isExpiringSoon && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
              <CircleAlert className="size-4 shrink-0" />
              <span>Your plan is going to expire soon &middot; {formatDaysLeft(daysRemaining)}</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-foreground">You don&apos;t have any active plan</p>
          <p className="text-sm text-muted-foreground">Contact Yaaro to subscribe to a plan for your studio.</p>
        </div>
      )}
    </div>
  );
}
