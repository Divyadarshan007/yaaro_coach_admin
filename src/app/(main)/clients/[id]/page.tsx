import { notFound } from "next/navigation";

import { ClientDetailView } from "@/features/clients/components/detail/client-detail-view";
import { getClientDetail } from "@/features/clients/data/client-detail-mock-data";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = getClientDetail(id);

  if (!client) {
    notFound();
  }

  return <ClientDetailView client={client} />;
}
