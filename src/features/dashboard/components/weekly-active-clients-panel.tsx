import { BarChart3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { AddClientButton } from "@/features/dashboard/components/add-client-button";
import { WeeklyActiveClientsChart } from "@/features/dashboard/components/weekly-active-clients-chart";
import type { WeeklyActiveClients } from "@/features/dashboard/types/dashboard";

export function WeeklyActiveClientsPanel({ data }: { data: WeeklyActiveClients }) {
  const hasActivity = data.weeks.some((week) => week.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Active Clients</CardTitle>
      </CardHeader>
      <CardContent className="min-h-80">
        {hasActivity ? (
          <WeeklyActiveClientsChart data={data} />
        ) : (
          <EmptyState
            icon={BarChart3}
            title="No active clients"
            description="There have been no active clients in the last 12 weeks"
            className="h-80 justify-center py-0"
            action={<AddClientButton variant="outline" size="default" />}
          />
        )}
      </CardContent>
    </Card>
  );
}
