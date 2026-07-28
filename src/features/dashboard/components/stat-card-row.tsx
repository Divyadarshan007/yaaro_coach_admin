import type { StatCardData } from "@/features/dashboard/types/dashboard";
import { StatCard } from "@/components/shared/stat-card";

export function StatCardRow({ stats }: { stats: StatCardData[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.id} title={stat.title} value={stat.value} href={stat.href} />
      ))}
    </div>
  );
}
