"use client";

import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import type { ProgressPicture } from "@/features/clients/types/client-detail";

export function ProgressPicturesCard({ pictures }: { pictures: ProgressPicture[] }) {
  const [index, setIndex] = useState(0);

  if (pictures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress Pictures</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={ImageOff}
            title="No progress pictures yet"
            description="Photos this client adds will show up here."
          />
        </CardContent>
      </Card>
    );
  }

  const picture = pictures[index];

  function goTo(delta: number) {
    setIndex((prev) => (prev + delta + pictures.length) % pictures.length);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Pictures</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted">
          {picture.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- backend-hosted photo, not worth Next/Image's optimization pipeline
            <img src={picture.imageUrl} alt={`Progress picture, ${picture.dateLabel}`} className="size-full object-cover" />
          ) : (
            <ImageOff className="size-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Previous picture"
            onClick={() => goTo(-1)}
            disabled={pictures.length < 2}
          >
            <ChevronLeft />
          </Button>
          <p className="text-sm text-muted-foreground">
            {picture.dateLabel} <span className="font-medium text-foreground">{picture.weightLabel}</span>
          </p>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Next picture"
            onClick={() => goTo(1)}
            disabled={pictures.length < 2}
          >
            <ChevronRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
