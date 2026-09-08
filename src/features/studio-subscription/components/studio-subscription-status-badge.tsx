import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TRANSACTION_STATUS_LABELS,
  type TransactionStatus,
} from "@/features/studio-subscription/types/studio-subscription";

const STATUS_CLASS: Record<TransactionStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  expired: "bg-muted text-muted-foreground",
  cancelled: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
};

export function StudioSubscriptionStatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <Badge variant="secondary" className={cn("rounded-md px-2.5 py-1", STATUS_CLASS[status])}>
      {TRANSACTION_STATUS_LABELS[status]}
    </Badge>
  );
}
