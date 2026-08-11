import { Cake } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import { avatarFromName } from "@/features/clients/lib/avatar";
import type { UpcomingBirthday } from "@/features/dashboard/types/dashboard";

function formatBirthdayLabel(nextBirthdayDate: string): string {
  return new Date(`${nextBirthdayDate}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatDaysUntil(daysUntil: number): string {
  if (daysUntil === 0) return "Today";
  if (daysUntil === 1) return "Tomorrow";
  return `In ${daysUntil} days`;
}

export function UpcomingBirthdaysPanel({ birthdays }: { birthdays: UpcomingBirthday[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Birthdays</CardTitle>
      </CardHeader>
      <CardContent className="min-h-80">
        {birthdays.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {birthdays.map((birthday) => (
              <li key={birthday.id}>
                <Link
                  href={`/clients/${birthday.id}`}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent"
                >
                  <PersonAvatar avatar={avatarFromName(birthday.name || "Client", birthday.id)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{birthday.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatBirthdayLabel(birthday.nextBirthdayDate)} · Turning {birthday.turningAge}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-muted-foreground">
                    {formatDaysUntil(birthday.daysUntil)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Cake}
            title="No upcoming birthdays"
            description="No clients have a birthday in the next 30 days"
            className="h-80 justify-center py-0"
          />
        )}
      </CardContent>
    </Card>
  );
}
