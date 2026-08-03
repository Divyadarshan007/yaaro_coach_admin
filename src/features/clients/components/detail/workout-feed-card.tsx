"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import type { AvatarInfo } from "@/features/clients/types/client";
import type { FeedItem } from "@/features/clients/types/workout-feed";

const VISIBLE_EXERCISE_COUNT = 3;

const ACTIVITY_LABELS: Record<string, string> = {
  Time: "Duration",
  Set: "Sets",
};

function formatActivityValue(activity: string, data: unknown): string {
  const value = typeof data === "number" ? data : Number(data);
  if (Number.isNaN(value)) return String(data);

  switch (activity) {
    case "Time": {
      const totalMinutes = Math.round(value / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
    }
    case "Volume":
      return `${Math.round(value).toLocaleString("en-US")} kg`;
    case "Set":
      return `${value} sets`;
    case "Distance":
      return value >= 1000 ? `${(value / 1000).toFixed(2)} km` : `${Math.round(value)} m`;
    case "Steps":
      return `${Math.round(value).toLocaleString("en-US")} steps`;
    case "Calories":
      return `${Math.round(value)} cal`;
    default:
      return String(data);
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function WorkoutFeedCard({ feed, clientAvatar, clientName }: {
  feed: FeedItem;
  clientAvatar: AvatarInfo;
  clientName: string;
}) {
  const [showAllExercises, setShowAllExercises] = useState(false);

  const visibleExercises = showAllExercises ? feed.exercises : feed.exercises.slice(0, VISIBLE_EXERCISE_COUNT);
  const hiddenCount = feed.exercises.length - visibleExercises.length;

  return (
    <Card>
      <CardHeader className="flex-row items-start gap-3">
        <PersonAvatar avatar={clientAvatar} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{clientName}</p>
          <p className="text-xs text-muted-foreground">{formatDate(feed.startTime)}</p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {feed.title && <p className="text-base font-medium text-foreground">{feed.title}</p>}

        {feed.activityData.length > 0 && (
          <div className="flex gap-6">
            {feed.activityData.map((point) => (
              <div key={point.activity}>
                <p className="text-xs text-muted-foreground">{ACTIVITY_LABELS[point.activity] ?? point.activity}</p>
                <p className="text-sm font-medium text-foreground">
                  {formatActivityValue(point.activity, point.data)}
                </p>
              </div>
            ))}
          </div>
        )}

        {feed.exercises.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-border pt-3">
            {visibleExercises.map((exercise) => (
              <p key={exercise.id} className="text-sm text-foreground">
                {exercise.totalSet} sets {exercise.title}
              </p>
            ))}
            {hiddenCount > 0 && (
              <button
                type="button"
                className="self-start text-sm text-primary hover:underline"
                onClick={() => setShowAllExercises(true)}
              >
                See {hiddenCount} more exercises
              </button>
            )}
          </div>
        )}

        {feed.media.length > 0 && (
          <div className="flex flex-col gap-1 overflow-hidden rounded-lg">
            {feed.media.map((item, index) =>
              item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={index} src={item.url} alt="" className="w-full object-cover" />
              ) : null
            )}
          </div>
        )}

        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{feed.likeCount} likes</span>
          <span>{feed.commentCount} comments</span>
        </div>
      </CardContent>
    </Card>
  );
}
