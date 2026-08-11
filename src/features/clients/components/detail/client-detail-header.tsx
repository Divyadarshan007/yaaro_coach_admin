import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import type { ClientDetail } from "@/features/clients/types/client-detail";

export function ClientDetailHeader({ client }: { client: ClientDetail }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <PersonAvatar avatar={client.avatar} className="size-20 text-xl" />
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{client.name}</h1>
          <p className="text-sm text-muted-foreground">{client.email}</p>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Coached by</span>
            <PersonAvatar avatar={client.coach} size="sm" />
            <span className="font-medium text-foreground">{client.coach.name}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Client options">
          <MoreVertical />
        </Button>
      </div>
    </div>
  );
}
