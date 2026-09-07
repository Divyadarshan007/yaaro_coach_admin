import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LEAD_STATUS_LABELS, type CoachLeadStatus } from "@/features/leads/types/lead";

const STATUS_CLASS: Record<CoachLeadStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  inprogress: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  converted: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
};

export function LeadStatusBadge({ status }: { status: CoachLeadStatus }) {
  return (
    <Badge variant="secondary" className={cn("rounded-md px-2.5 py-1", STATUS_CLASS[status])}>
      {LEAD_STATUS_LABELS[status]}
    </Badge>
  );
}
