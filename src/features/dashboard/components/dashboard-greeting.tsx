"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardGreeting({ name }: { name: string }) {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Hello, {name} 👋</h1>
        <p className="text-sm text-muted-foreground">Get an overview of your clients&apos; progress.</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search clients"
            className="h-9 w-full pl-9 sm:w-56"
          />
        </div>
        <Button size="lg">+ Add Client</Button>
      </div>
    </div>
  );
}
