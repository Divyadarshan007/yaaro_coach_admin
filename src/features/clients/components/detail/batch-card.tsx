"use client";

import { CalendarClock } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignBatchDialog } from "@/features/clients/components/assign-batch-dialog";
import { formatTime } from "@/features/batch/lib/format";
import type { ClientDetail } from "@/features/clients/types/client-detail";

export function BatchCard({ client }: { client: ClientDetail }) {
  const [isOpen, setIsOpen] = useState(false);
  const { batch } = client;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Batch</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          {batch ? "Change batch" : "Assign batch"}
        </Button>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        {batch ? (
          <>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <CalendarClock className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {batch.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatTime(batch.startTime)}–{formatTime(batch.endTime)}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Not assigned to a batch yet.
          </p>
        )}
      </CardContent>

      <AssignBatchDialog
        clientId={client.id}
        clientName={client.name}
        currentBatchId={batch?.id ?? null}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </Card>
  );
}
