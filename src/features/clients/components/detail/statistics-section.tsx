import { BodyweightChartCard } from "@/features/clients/components/detail/bodyweight-chart-card";
import { CalendarCard } from "@/features/clients/components/detail/calendar-card";
import { ProgressPicturesCard } from "@/features/clients/components/detail/progress-pictures-card";
import { StatChartCard } from "@/features/clients/components/detail/stat-chart-card";
import type { ClientDetail } from "@/features/clients/types/client-detail";

export function StatisticsSection({ client }: { client: ClientDetail }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">Statistics</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatChartCard stat={client.duration} />
        <StatChartCard stat={client.volume} />
        <StatChartCard stat={client.sets} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CalendarCard />
        <BodyweightChartCard bodyweight={client.bodyweight} />
        <ProgressPicturesCard pictures={client.progressPictures} />
      </div>
    </div>
  );
}
