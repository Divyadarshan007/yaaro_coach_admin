"use client";

import { Check, X } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import { avatarFromName } from "@/features/clients/lib/avatar";
import { approveJoinRequestAction, rejectJoinRequestAction } from "@/features/clients/actions";
import type { StudioJoinRequest } from "@/lib/api/studio-join-requests";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function RequestRow({ request }: { request: StudioJoinRequest }) {
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(kind: "approve" | "reject") {
    setError(null);
    setAction(kind);
    startTransition(async () => {
      try {
        if (kind === "approve") {
          await approveJoinRequestAction(request.id);
        } else {
          await rejectJoinRequestAction(request.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setAction(null);
      }
    });
  }

  const busy = isPending && action !== null;

  return (
    <li className="flex flex-wrap items-center gap-3 py-3">
      <PersonAvatar avatar={avatarFromName(request.name || request.email || "?", request.id)} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {request.name || request.email || "Unknown user"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {request.email ? `${request.email} · ` : ""}
          {timeAgo(request.requestedAt)}
        </p>
        {error && <p className="mt-0.5 text-xs text-destructive">{error}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => run("reject")}
        >
          <X />
          {action === "reject" && isPending ? "Rejecting…" : "Reject"}
        </Button>
        <Button size="sm" disabled={busy} onClick={() => run("approve")}>
          <Check />
          {action === "approve" && isPending ? "Approving…" : "Approve"}
        </Button>
      </div>
    </li>
  );
}

export function PendingJoinRequests({ requests }: { requests: StudioJoinRequest[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Join requests
          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {requests.length}
          </span>
        </CardTitle>
        <CardDescription>
          People who scanned your studio QR in the Yaaro app. Approve to add them as a client.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-foreground/10">
          {requests.map((request) => (
            <RequestRow key={request.id} request={request} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
