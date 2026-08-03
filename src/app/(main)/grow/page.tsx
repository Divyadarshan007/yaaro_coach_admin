import { GrowView } from "@/features/grow/components/grow-view";
import { getCoachProfile } from "@/lib/api/coach";
import { getLeads } from "@/lib/api/leads";

export default async function GrowPage() {
  const [coach, leads] = await Promise.all([getCoachProfile(), getLeads()]);
  const pendingLeads = leads.filter((lead) => lead.status === "pending");

  return <GrowView slug={coach?.slug ?? ""} leads={pendingLeads} />;
}
