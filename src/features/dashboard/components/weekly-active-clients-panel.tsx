import { BarChart3, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { WeeklyActiveClientsChart } from "@/features/dashboard/components/weekly-active-clients-chart";
import type { WeeklyChartAxis } from "@/features/dashboard/types/dashboard";

export function WeeklyActiveClientsPanel({ axis }: { axis: WeeklyChartAxis }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Active Clients</CardTitle>
      </CardHeader>
      <CardContent className="relative min-h-80">
        <WeeklyActiveClientsChart axis={axis} />
        <div className="absolute inset-0 flex items-center justify-center bg-card/90">
          <EmptyState
            icon={BarChart3}
            title="No active clients"
            description="There have been no active clients in the last 12 weeks"
            action={
              <Button variant="outline">
                <Plus className="size-4" />
                Add Client
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
