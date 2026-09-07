import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MembershipPlansTable } from "@/features/membership-plan/components/membership-plans-table";
import type { MembershipPlan } from "@/features/membership-plan/types/membership-plan";

export function MembershipPlansView({ plans }: { plans: MembershipPlan[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium text-foreground">Membership Plan</h1>
          <p className="text-sm text-muted-foreground">
            Define membership durations and pricing for your clients
          </p>
        </div>
        <Button size="lg" nativeButton={false} render={<Link href="/membership-plan/new" />}>
          <Plus />
          Add Plan
        </Button>
      </div>

      <MembershipPlansTable plans={plans} />
    </div>
  );
}
