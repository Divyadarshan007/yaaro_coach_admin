import { BatchesView } from "@/features/batch/components/batches-view";
import { getBatches } from "@/lib/api/batches";

export default async function BatchPage() {
  const batches = await getBatches();
  return <BatchesView batches={batches} />;
}
