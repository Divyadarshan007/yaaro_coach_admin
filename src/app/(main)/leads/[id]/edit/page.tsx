import { notFound } from "next/navigation";

import { EditLeadView } from "@/features/leads/components/edit-lead-view";
import { getCoachLeads, getLeadSources } from "@/lib/api/coach-leads";

export default async function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [leads, sources] = await Promise.all([getCoachLeads(), getLeadSources()]);
  const lead = leads.find((l) => l.id === id);
  if (!lead) notFound();
  return <EditLeadView lead={lead} sources={sources} />;
}
