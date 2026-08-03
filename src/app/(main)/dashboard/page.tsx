import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { coachDisplayName } from "@/features/dashboard/data/dashboard-mock-data";
import { getDashboardStats } from "@/lib/api/dashboard";
import type { StatCardData } from "@/features/dashboard/types/dashboard";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards: StatCardData[] = [
    { id: "total-clients", title: "Total Clients", value: stats.totalClients, href: "/clients" },
    { id: "active-clients", title: "Active clients last 7 days", value: stats.activeClients, href: "/clients" },
    { id: "inactive-clients", title: "Inactive clients last 7 days", value: stats.inactiveClients, href: "/clients" },
  ];

  return (
    <DashboardView coachName={coachDisplayName} stats={statCards} weeklyActiveClients={stats.weeklyActiveClients} />
  );
}
