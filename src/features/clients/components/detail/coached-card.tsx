import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import type { ClientDetail } from "@/features/clients/types/client-detail";

export function CoachedCard({ client }: { client: ClientDetail }) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Coached</CardTitle>
        <button type="button" className="text-sm text-primary hover:underline">
          Change Coach
        </button>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <PersonAvatar avatar={client.coach} size="lg" />
        <div>
          <p className="text-sm font-medium text-foreground">{client.coach.name}</p>
          <p className="text-sm text-muted-foreground">{client.coachedSinceLabel}</p>
        </div>
      </CardContent>
    </Card>
  );
}
