import { Activity, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export function LatestActivitiesPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Activities</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-80 items-center justify-center">
        <EmptyState
          icon={Activity}
          title="No activities yet"
          description="Your clients do not have any recent activities"
          action={
            <Button variant="outline">
              <Plus className="size-4" />
              Add Client
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}
