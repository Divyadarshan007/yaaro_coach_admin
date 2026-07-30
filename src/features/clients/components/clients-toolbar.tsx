"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { AddClientDialog } from "@/features/clients/components/add-client-dialog";

type ClientsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function ClientsToolbar({ search, onSearchChange }: ClientsToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative sm:w-64">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search clients"
          className="h-9 w-full pl-9"
        />
      </div>
      <AddClientDialog />
    </div>
  );
}
