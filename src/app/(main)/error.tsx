"use client";

import { WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MainSegmentError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center">
      <Card className="max-w-sm items-center px-6 py-8 text-center">
        <CardContent className="flex flex-col items-center gap-3 px-0">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <WifiOff className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-heading text-base font-medium">Couldn&apos;t load this page</p>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t reach the server. Check your connection and try again.
            </p>
          </div>
          <Button className="mt-2" onClick={() => unstable_retry()}>
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
