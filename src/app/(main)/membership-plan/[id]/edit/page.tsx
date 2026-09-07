import { notFound } from "next/navigation";

import { EditMembershipPlanView } from "@/features/membership-plan/components/edit-membership-plan-view";
import { getMembershipPlans } from "@/lib/api/membership-plans";

export default async function EditMembershipPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plans = await getMembershipPlans();
  const plan = plans.find((p) => p.id === id);
  if (!plan) notFound();
  return <EditMembershipPlanView plan={plan} />;
}
