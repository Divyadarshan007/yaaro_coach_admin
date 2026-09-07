import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BatchesTable } from "@/features/batch/components/batches-table";
import type { Batch } from "@/features/batch/types/batch";

export function BatchesView({ batches }: { batches: Batch[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium text-foreground">Batch</h1>
          <p className="text-sm text-muted-foreground">
            Schedule group training slots and place your clients into them
          </p>
        </div>
        <Button size="lg" nativeButton={false} render={<Link href="/batch/new" />}>
          <Plus />
          Add Batch
        </Button>
      </div>

      <BatchesTable batches={batches} />
    </div>
  );
}
