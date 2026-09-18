"use client";

import { Activity } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { getClientFeedsAction } from "@/features/clients/actions";
import { WorkoutFeedCard } from "@/features/clients/components/detail/workout-feed-card";
import type { AvatarInfo } from "@/features/clients/types/client";
import type { FeedItem } from "@/features/clients/types/workout-feed";
import { handleMutationError } from "@/lib/handle-mutation-error";

const PAGE_SIZE = 10;

export function WorkoutHistoryColumn({
  clientId,
  clientName,
  clientAvatar,
  initialFeeds,
}: {
  clientId: string;
  clientName: string;
  clientAvatar: AvatarInfo;
  initialFeeds: FeedItem[];
}) {
  const [feeds, setFeeds] = useState(initialFeeds);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialFeeds.length === PAGE_SIZE);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    setError(null);
    startTransition(async () => {
      try {
        const nextPage = page + 1;
        const nextFeeds = await getClientFeedsAction(clientId, nextPage);
        setFeeds((prev) => [...prev, ...nextFeeds]);
        setPage(nextPage);
        setHasMore(nextFeeds.length === PAGE_SIZE);
      } catch (err) {
        handleMutationError(err, setError);
      }
    });
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <h2 className="text-base font-medium text-foreground">Workout History</h2>

      {feeds.length === 0 ? (
        <Card className="h-full">
          <CardContent>
            <EmptyState
              icon={Activity}
              title="No workouts yet"
              description="This client hasn't logged any workouts yet."
              className="py-16"
            />
          </CardContent>
        </Card>
      ) : (
        feeds.map((feed) => (
          <WorkoutFeedCard
            key={feed.id}
            feed={feed}
            clientAvatar={clientAvatar}
            clientName={clientName}
          />
        ))
      )}

      {error && <p className="self-center text-sm text-destructive">{error}</p>}

      {hasMore && (
        <Button
          variant="outline"
          onClick={loadMore}
          disabled={isPending}
          className="self-center"
        >
          {isPending ? "Loading..." : "Load more"}
        </Button>
      )}
    </div>
  );
}
