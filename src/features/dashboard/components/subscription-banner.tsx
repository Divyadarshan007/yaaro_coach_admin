import { CircleAlert, CreditCard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CurrentSubscription } from "@/features/dashboard/types/dashboard";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDaysRemaining(days: number): string {
  if (days <= 0) return "Expires today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

export function SubscriptionBanner({ subscription }: { subscription: CurrentSubscription | null }) {
  if (!subscription) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="flex items-center gap-3 py-4">
          <CircleAlert className="size-5 shrink-0 text-destructive" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">You don&apos;t have any active plan</p>
            <p className="text-sm text-muted-foreground">Contact Yaaro to subscribe to a plan for your studio.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-3 py-4">
        <CreditCard className="size-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{subscription.planTitle}</p>
            <Badge
              variant="secondary"
              className="bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
            >
              Active
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(subscription.startDate)} – {formatDate(subscription.expiryDate)}
          </p>
        </div>
        <span className="shrink-0 text-sm font-medium text-muted-foreground">
          {formatDaysRemaining(subscription.daysRemaining)}
        </span>
      </CardContent>
    </Card>
  );
}
