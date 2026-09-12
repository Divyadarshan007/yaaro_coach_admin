import { CreditCard } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MembershipPlanRow } from "@/features/membership-plan/components/membership-plan-row";
import type { MembershipPlan } from "@/features/membership-plan/types/membership-plan";

const headerCellClassName = "px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase";

export function MembershipPlansTable({ plans }: { plans: MembershipPlan[] }) {
  if (plans.length === 0) {
    return (
      <div className="rounded-xl bg-card ring-1 ring-foreground/10">
        <EmptyState
          className="min-h-64 justify-center"
          icon={CreditCard}
          title="No membership plans yet"
          description="Create a plan to define a membership duration and price for your clients."
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className={headerCellClassName}>Title</TableHead>
            <TableHead className={headerCellClassName}>Validity</TableHead>
            <TableHead className={headerCellClassName}>Price</TableHead>
            <TableHead className={headerCellClassName}>Active Members</TableHead>
            <TableHead className={headerCellClassName}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <MembershipPlanRow key={plan.id} plan={plan} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
