"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadsTable } from "@/features/leads/components/leads-table";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  type CoachLead,
  type CoachLeadStatus,
} from "@/features/leads/types/lead";

const ALL_STATUSES = "all";

export function LeadsView({ leads }: { leads: CoachLead[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== ALL_STATUSES && lead.status !== statusFilter)
        return false;
      if (!query) return true;
      return (
        lead.name.toLowerCase().includes(query) ||
        lead.number.toLowerCase().includes(query) ||
        (lead.source?.name.toLowerCase().includes(query) ?? false)
      );
    });
  }, [leads, search, statusFilter]);

  const isFiltered = search.trim().length > 0 || statusFilter !== ALL_STATUSES;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium text-foreground">
            Leads
          </h1>
          <p className="text-sm text-muted-foreground">
            Track prospects you&apos;re following up with and where they came
            from
          </p>
        </div>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/leads/new" />}
        >
          <Plus />
          Add Lead
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, number or source"
            className="h-9 w-full pl-9"
          />
        </div>
        <Select<string>
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value ?? ALL_STATUSES)}
        >
          <SelectTrigger className="w-44">
            <SelectValue>
              {(value: string) =>
                value === ALL_STATUSES
                  ? "All statuses"
                  : LEAD_STATUS_LABELS[value as CoachLeadStatus]
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
            {LEAD_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {LEAD_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <LeadsTable leads={filteredLeads} isFiltered={isFiltered} />
    </div>
  );
}
