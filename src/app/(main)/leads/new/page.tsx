import { CreateLeadView } from "@/features/leads/components/create-lead-view";
import { getLeadSources } from "@/lib/api/coach-leads";

export default async function NewLeadPage() {
  const sources = await getLeadSources();
  return <CreateLeadView sources={sources} />;
}
