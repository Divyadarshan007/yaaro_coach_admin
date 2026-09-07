import { LeadsView } from "@/features/leads/components/leads-view";
import { getCoachLeads } from "@/lib/api/coach-leads";

export default async function LeadsPage() {
  const leads = await getCoachLeads();
  return <LeadsView leads={leads} />;
}
