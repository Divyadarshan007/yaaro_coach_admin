"use client";

import { UserX } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import { avatarFromName } from "@/features/clients/lib/avatar";
import type { AbsentMember } from "@/features/dashboard/types/dashboard";
import { cn } from "@/lib/utils";

const DAY_MS = 24 * 60 * 60 * 1000;

const WINDOWS = [
  { id: "today", label: "Today", days: 0 },
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "1m", label: "1 month", days: 30 },
] as const;

type WindowId = (typeof WINDOWS)[number]["id"];

// The backend list already excludes anyone who checked in today, so every entry is
// "absent today". The wider windows keep only members whose last check-in is older
// than the window (or who have never checked in).
function isAbsentInWindow(member: AbsentMember, days: number): boolean {
  if (days === 0) return true;
  if (!member.lastCheckInAt) return true;
  return Date.now() - new Date(member.lastCheckInAt).getTime() >= days * DAY_MS;
}

function formatLastSeen(iso: string | null): string {
  if (!iso) return "Never checked in";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / DAY_MS);
  if (days <= 0) return "Last seen today";
  if (days === 1) return "Last seen yesterday";
  if (days < 30) return `Last seen ${days} days ago`;
  const months = Math.floor(days / 30);
  return `Last seen ${months} month${months === 1 ? "" : "s"} ago`;
}

export function AbsentMembersPanel({ members }: { members: AbsentMember[] }) {
  const [window, setWindow] = useState<WindowId>("today");
  const days = WINDOWS.find((w) => w.id === window)!.days;

  const filtered = useMemo(
    () => members.filter((member) => isAbsentInWindow(member, days)),
    [members, days],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3">
        <CardTitle>Absent ({filtered.length})</CardTitle>
        <div className="flex flex-wrap gap-1.5">
          {WINDOWS.map((w) => (
            <button
              key={w.id}
              type="button"
              aria-pressed={w.id === window}
              onClick={() => setWindow(w.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                w.id === window
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              {w.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="min-h-80">
        {filtered.length > 0 ? (
          <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto">
            {filtered.map((member) => (
              <li key={member.id}>
                <Link
                  href={`/clients/${member.id}`}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent"
                >
                  <PersonAvatar
                    avatar={avatarFromName(member.name || "Client", member.id)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatLastSeen(member.lastCheckInAt)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={UserX}
            title="Nobody's absent"
            description="Every client has checked in within this window"
            className="h-80 justify-center py-0"
          />
        )}
      </CardContent>
    </Card>
  );
}
