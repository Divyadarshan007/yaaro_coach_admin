"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { UserPlus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  approveClubJoinRequestAction,
  rejectClubJoinRequestAction,
} from "@/features/clubs/actions";
import { avatarFromName } from "@/features/clients/lib/avatar";
import type { ClubJoinRequest } from "@/features/clubs/types/club";

export function ClubJoinRequestsTab({
  clubId,
  requests,
}: {
  clubId: string;
  requests: ClubJoinRequest[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function act(userId: string, action: () => Promise<void>) {
    setError(null);
    setPendingId(userId);
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setPendingId(null);
      }
    });
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-xl bg-card ring-1 ring-foreground/10">
        <EmptyState
          className="min-h-64 justify-center"
          icon={UserPlus}
          title="No pending requests"
          description="Join requests for this private club will appear here for you to approve."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-col divide-y divide-border rounded-xl bg-card ring-1 ring-foreground/10">
        {requests.map((request) => {
          const name = request.fullName || request.userName || "Member";
          const avatar = avatarFromName(name, request.id);
          const busy = pendingId === request.id;
          return (
            <div
              key={request.id}
              className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  {request.profileImage && <AvatarImage src={request.profileImage} alt={name} />}
                  <AvatarFallback className={avatar.colorClassName}>{avatar.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{name}</span>
                  {request.userName && (
                    <span className="text-xs text-muted-foreground">@{request.userName}</span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => act(request.id, () => rejectClubJoinRequestAction(clubId, request.id))}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  disabled={busy}
                  onClick={() => act(request.id, () => approveClubJoinRequestAction(clubId, request.id))}
                >
                  {busy ? "..." : "Approve"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
