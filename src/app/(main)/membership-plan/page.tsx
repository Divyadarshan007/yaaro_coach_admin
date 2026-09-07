import { MembershipPlansView } from "@/features/membership-plan/components/membership-plans-view";
import { getMembershipPlans } from "@/lib/api/membership-plans";

export default async function MembershipPlanPage() {
  const plans = await getMembershipPlans();
  return <MembershipPlansView plans={plans} />;
}
