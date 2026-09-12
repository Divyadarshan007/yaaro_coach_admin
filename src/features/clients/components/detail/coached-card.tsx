"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeCoachDialog } from "@/features/clients/components/detail/change-coach-dialog";
import { PersonAvatar } from "@/features/clients/components/person-avatar";
import type { ClientDetail } from "@/features/clients/types/client-detail";
import type { TeamMember } from "@/features/team/types/team";

export function CoachedCard({
  client,
  teamMembers,
}: {
  client: ClientDetail;
  teamMembers: TeamMember[];
}) {
  const [isChangeCoachOpen, setIsChangeCoachOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Coached</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsChangeCoachOpen(true)}
        >
          Change Coach
        </Button>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <PersonAvatar avatar={client.coach} size="lg" />
        <div>
          <p className="text-sm font-medium text-foreground">
            {client.coach.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {client.coachedSinceLabel}
          </p>
        </div>
      </CardContent>

      <ChangeCoachDialog
        clientId={client.id}
        clientName={client.name}
        teamMembers={teamMembers}
        open={isChangeCoachOpen}
        onOpenChange={setIsChangeCoachOpen}
      />
    </Card>
  );
}
