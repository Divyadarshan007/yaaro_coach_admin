import { ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: number | string;
  href?: string;
  className?: string;
};

// `href` isn't wired to a click/navigation right now — none of these stats have a
// dedicated destination yet (they'd all just point at the unfiltered /clients list).
// Kept on the type/data so it's a one-line change to re-enable once there's somewhere
// real to send each card.
export function StatCard({ title, value, className }: StatCardProps) {
  return (
    <Card className={cn("gap-3 p-5", className)}>
      <div className="flex items-center justify-between gap-2 text-sm font-medium text-muted-foreground">
        <span>{title}</span>
        <ChevronRight className="size-4 shrink-0" />
      </div>
      <p className="text-3xl font-semibold text-foreground">{value}</p>
    </Card>
  );
}
