import { Camera, Columns2 } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogMeasurementDialog } from "@/features/clients/components/detail/log-measurement-dialog";
import type { ClientMeasurement } from "@/features/clients/types/measurement";

function formatDateLabel(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ClientProgressPicturesTab({
  clientId,
  measurements,
}: {
  clientId: string;
  measurements: ClientMeasurement[];
}) {
  const pictures = measurements.filter((measurement) => measurement.image);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">Progress Pictures</h2>
        <Button variant="outline" size="sm" disabled>
          <Columns2 />
          Comparison
        </Button>
      </div>

      {pictures.length > 0 ? (
        <Card>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {pictures.map((picture) => (
                <div key={picture.id} className="flex flex-col gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element -- backend-hosted upload, arbitrary host */}
                  <img
                    src={picture.image}
                    alt={`Progress picture from ${formatDateLabel(picture.date)}`}
                    className="aspect-square w-full rounded-lg object-cover ring-1 ring-foreground/10"
                  />
                  <span className="text-xs text-muted-foreground">{formatDateLabel(picture.date)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <LogMeasurementDialog clientId={clientId}>Log Measurement</LogMeasurementDialog>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <EmptyState
              icon={Camera}
              title="No Progress Pictures"
              description={
                <>
                  No progress pictures have been added by your client in the Yaaro app yet.{" "}
                  <span className="cursor-pointer text-primary hover:underline">Learn More</span>
                </>
              }
              action={<LogMeasurementDialog clientId={clientId}>Log Measurement</LogMeasurementDialog>}
              className="py-16"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
