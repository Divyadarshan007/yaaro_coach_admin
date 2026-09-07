import { notFound } from "next/navigation";

import { EditBatchView } from "@/features/batch/components/edit-batch-view";
import { getBatches } from "@/lib/api/batches";

export default async function EditBatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const batches = await getBatches();
  const batch = batches.find((b) => b.id === id);
  if (!batch) notFound();
  return <EditBatchView batch={batch} />;
}
