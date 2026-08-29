"use client";

import { useRouter } from "next/navigation";
import { Globe, Lock, Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CLUB_SPORT_TYPE_LABELS } from "@/features/clubs/types/club";
import type { Club, ClubSportType } from "@/features/clubs/types/club";

const headerCellClassName = "px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase";

function sportLabel(sportType: string): string {
  return CLUB_SPORT_TYPE_LABELS[sportType as ClubSportType] ?? sportType;
}

function locationText(club: Club): string {
  if (club.locationType !== "city") return "Global";
  return [club.location.city, club.location.state, club.location.country].filter(Boolean).join(", ") || "City-based";
}

export function ClubsTable({ clubs, emptyDescription }: { clubs: Club[]; emptyDescription: string }) {
  const router = useRouter();

  if (clubs.length === 0) {
    return (
      <div className="rounded-xl bg-card ring-1 ring-foreground/10">
        <EmptyState
          className="min-h-64 justify-center"
          icon={Users}
          title="No clubs here"
          description={emptyDescription}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className={headerCellClassName}>Club</TableHead>
            <TableHead className={headerCellClassName}>Activity</TableHead>
            <TableHead className={headerCellClassName}>Visibility</TableHead>
            <TableHead className={headerCellClassName}>Members</TableHead>
            <TableHead className={headerCellClassName}>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubs.map((club) => {
            const thumb = club.imageUrl || club.coverImageUrl;
            return (
              <TableRow
                key={club.id}
                className="cursor-pointer"
                onClick={() => router.push(`/clubs/${club.id}`)}
              >
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt="" className="size-full object-cover" />
                      ) : (
                        <Users className="size-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-foreground">{club.title}</span>
                      {club.description && (
                        <span className="max-w-xs truncate text-xs text-muted-foreground">
                          {club.description}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3 text-sm text-foreground">{sportLabel(club.sportType)}</TableCell>

                <TableCell className="px-4 py-3">
                  <Badge variant="secondary" className="gap-1">
                    {club.visibility === "private" ? <Lock /> : <Globe />}
                    {club.visibility === "private" ? "Private" : "Public"}
                  </Badge>
                </TableCell>

                <TableCell className="px-4 py-3 text-sm text-foreground">{club.memberCount}</TableCell>

                <TableCell className="px-4 py-3 text-sm text-muted-foreground">{locationText(club)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
