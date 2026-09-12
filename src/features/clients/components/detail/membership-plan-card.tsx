"use client";

import { CreditCard } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignMembershipPlanDialog } from "@/features/clients/components/assign-membership-plan-dialog";
import type { ClientDetail } from "@/features/clients/types/client-detail";
import { cn } from "@/lib/utils";

// "2027-03-08T..." -> "8 Mar 2027"
function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function MembershipPlanCard({ client }: { client: ClientDetail }) {
  const [isOpen, setIsOpen] = useState(false);
  const { membership } = client;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Membership Plan</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          {membership ? "Change plan" : "Assign plan"}
        </Button>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        {membership ? (
          <>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <CreditCard className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {membership.plan.title}
              </p>
              <p
                className={cn(
                  "text-sm",
                  membership.expired
                    ? "text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {membership.expired ? "Expired " : "Expires "}
                {formatShortDate(membership.endDate)}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No membership plan assigned yet.
          </p>
        )}
      </CardContent>

      <AssignMembershipPlanDialog
        clientId={client.id}
        clientName={client.name}
        currentPlanId={membership?.plan.id ?? null}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </Card>
  );
}
