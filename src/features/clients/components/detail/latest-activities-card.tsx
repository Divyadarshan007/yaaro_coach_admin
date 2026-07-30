import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { Activity } from "lucide-react";
import type { ActivityItem } from "@/features/clients/types/client-detail";

export function LatestActivitiesCard({ activities }: { activities: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Latest Activities</CardTitle>
        <button type="button" className="text-sm text-primary hover:underline">
          See all
        </button>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <EmptyState icon={Activity} title="No activity yet" description="Nothing to show here yet." />
        ) : (
          <ul className="flex flex-col gap-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-start gap-3">
                <PersonAvatar avatar={activity.avatar} />
                <div className="min-w-0">
                  <p className="text-sm text-foreground">
                    {activity.segments.map((segment, index) => (
                      <span key={index} className={segment.emphasis ? "font-medium text-primary" : undefined}>
                        {segment.text}
                      </span>
                    ))}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
