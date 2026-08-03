"use client";

import { Search, Users } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddClientDialog } from "@/features/clients/components/add-client-dialog";
import { declineLeadAction, inviteLeadAction } from "@/features/grow/actions";
import type { Lead } from "@/features/grow/types/grow";

export function GrowLeadsPanel({ leads }: { leads: Lead[] }) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [invitingLead, setInvitingLead] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return leads;
    return leads.filter(
      (lead) => lead.name.toLowerCase().includes(query) || lead.email.toLowerCase().includes(query)
    );
  }, [leads, search]);

  function handleDecline(id: string) {
    startTransition(async () => {
      await declineLeadAction(id);
    });
  }

  function handleInvite(lead: Lead) {
    setInvitingLead(lead);
    startTransition(async () => {
      await inviteLeadAction(lead.id);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium text-foreground">Leads</h2>
          <Badge variant="outline">{leads.length}</Badge>
        </div>
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search leads"
            className="h-9 w-full pl-9"
          />
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <EmptyState
          className="min-h-80 justify-center rounded-xl bg-card ring-1 ring-foreground/10"
          icon={Users}
          title="No leads yet"
          description="Get leads by pasting the link in your webpage or social media bio."
        />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl bg-card ring-1 ring-foreground/10">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">
                  {lead.name} <span className="font-normal text-muted-foreground">({lead.email})</span>
                </span>
                {lead.message && <span className="text-sm text-muted-foreground">{lead.message}</span>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleDecline(lead.id)}>
                  Decline
                </Button>
                <Button size="sm" disabled={isPending} onClick={() => handleInvite(lead)}>
                  Invite
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddClientDialog
        open={invitingLead !== null}
        onOpenChange={(open) => {
          if (!open) setInvitingLead(null);
        }}
        defaultEmail={invitingLead?.email}
      />
    </div>
  );
}
