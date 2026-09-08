import { Wallet } from "lucide-react";

import { StudioSubscriptionStatusBadge } from "@/features/studio-subscription/components/studio-subscription-status-badge";
import { formatAmount, formatDate, formatDuration } from "@/features/studio-subscription/lib/format";
import type { StudioSubscriptionTransaction } from "@/features/studio-subscription/types/studio-subscription";

// Read-only. Coaches can't create or take plans — an admin assigns one to the studio.
export function CurrentSubscriptionCard({
  subscription,
}: {
  subscription: StudioSubscriptionTransaction | null;
}) {
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
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">Plan</dt>
            <dd className="font-medium text-foreground">{subscription.subscription?.title ?? "—"}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">Amount</dt>
            <dd className="text-foreground">{formatAmount(subscription.amount)}</dd>
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
      ) : (
        <p className="text-sm text-muted-foreground">
          Your studio isn&apos;t on a subscription plan. An admin assigns one.
        </p>
      )}
    </div>
  );
}
