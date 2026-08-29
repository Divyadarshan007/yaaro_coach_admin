"use client";

import { useEffect, useState, useTransition } from "react";
import { BarChart3, Trophy } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { getClubStatsAction } from "@/features/clubs/actions";
import { CLUB_STAT_PERIODS, CLUB_STAT_PERIOD_LABELS } from "@/features/clubs/types/club";
import type {
  ClubLeaderboardRow,
  ClubStatItem,
  ClubStatPeriod,
} from "@/features/clubs/types/club";
import { cn } from "@/lib/utils";

function formatValue(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(n);
}

export function ClubStatsTab({ clubId }: { clubId: string }) {
  const [period, setPeriod] = useState<ClubStatPeriod>("weekly");
  const [stats, setStats] = useState<ClubStatItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<ClubLeaderboardRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      try {
        const data = await getClubStatsAction(clubId, period);
        if (cancelled) return;
        setStats(data.stats);
        setLeaderboard(data.leaderboard);
        setError(null);
        setLoaded(true);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load stats");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [clubId, period]);

  const loading = isPending || !loaded;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-fit flex-wrap gap-1 rounded-lg bg-muted p-1">
        {CLUB_STAT_PERIODS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              period === p
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {CLUB_STAT_PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="gap-3 p-5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </Card>
            ))
          : stats.map((stat) => (
              <Card key={stat.title} className="gap-2 p-5">
                <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                <p className="text-3xl font-semibold text-foreground">{formatValue(stat.data)}</p>
              </Card>
            ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Trophy className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Leaderboard</h3>
        </div>

        {loading ? (
          <div className="flex flex-col divide-y divide-border rounded-xl bg-card ring-1 ring-foreground/10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-9 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="ml-auto h-4 w-12" />
              </div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="rounded-xl bg-card ring-1 ring-foreground/10">
            <EmptyState
              className="min-h-48 justify-center"
              icon={BarChart3}
              title="No activity yet"
              description="Once members log workouts in this period, they'll be ranked here."
            />
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-xl bg-card ring-1 ring-foreground/10">
            {leaderboard.map((row) => {
              const name = row.fullName || row.userName || "Member";
              const av = avatarFromName(name, row.userId);
              return (
                <div
                  key={row.userId}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3",
                    row.currentUser && "bg-muted/40"
                  )}
                >
                  <span className="w-6 shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
                    {row.rank}
                  </span>
                  <Avatar>
                    {row.profileImage && <AvatarImage src={row.profileImage} alt={name} />}
                    <AvatarFallback className={av.colorClassName}>{av.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">{name}</span>
                    {row.userName && (
                      <span className="truncate text-xs text-muted-foreground">@{row.userName}</span>
                    )}
                  </div>
                  {row.isOwner && <Badge variant="secondary">Owner</Badge>}
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                    {formatValue(row.value)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
