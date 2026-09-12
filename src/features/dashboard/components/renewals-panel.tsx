import { CalendarClock } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import { avatarFromName } from "@/features/clients/lib/avatar";
import type { Renewal } from "@/features/dashboard/types/dashboard";

function formatExpiry(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDaysLeft(days: number): string {
  if (days <= 0) return "Expires today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

export function RenewalsPanel({ renewals }: { renewals: Renewal[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Renewals ({renewals.length})</CardTitle>
        <CardDescription>Memberships expiring in the next 30 days</CardDescription>
      </CardHeader>
      <CardContent className="min-h-80">
        {renewals.length > 0 ? (
          <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto">
            {renewals.map((renewal) => (
              <li key={renewal.id}>
                <Link
                  href={`/clients/${renewal.id}`}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent"
                >
                  <PersonAvatar
                    avatar={avatarFromName(
                      renewal.name || "Client",
                      renewal.id,
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {renewal.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {renewal.planTitle} · {formatExpiry(renewal.expiryDate)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-muted-foreground">
                    {formatDaysLeft(renewal.daysUntilExpiry)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={CalendarClock}
            title="No upcoming renewals"
            description="Renewals will appear here as they come up"
            className="h-80 justify-center py-0"
          />
        )}
      </CardContent>
    </Card>
  );
}
