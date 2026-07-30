import { ClientsView } from "@/features/clients/components/clients-view";
import { getMockClients } from "@/features/clients/data/clients-mock-data";

export default function ClientsPage() {
  const clients = getMockClients();

  return <ClientsView clients={clients} />;
}
