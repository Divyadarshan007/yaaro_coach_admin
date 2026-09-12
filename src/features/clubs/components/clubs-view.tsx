"use client";

import { Tabs } from "@base-ui/react/tabs";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClubsTable } from "@/features/clubs/components/clubs-table";
import type { Club } from "@/features/clubs/types/club";

// Re-enable alongside the commented-out Tabs.List below when "Joined"/"Discover" ship.
// const tabClassName =
//   "relative -mb-px border-b-2 border-transparent px-1 pb-3 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors hover:text-foreground data-active:border-primary data-active:text-foreground";

function filterClubs(clubs: Club[], query: string): Club[] {
  const q = query.trim().toLowerCase();
  if (!q) return clubs;
  return clubs.filter(
    (club) =>
      club.title.toLowerCase().includes(q) || club.description.toLowerCase().includes(q)
  );
}

export function ClubsView({
  ownClubs,
  joinedClubs,
  discoverClubs,
}: {
  ownClubs: Club[];
  joinedClubs: Club[];
  discoverClubs: Club[];
}) {
  const [activeTab, setActiveTab] = useState("own");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => ({
      own: filterClubs(ownClubs, search),
      joined: filterClubs(joinedClubs, search),
      discover: filterClubs(discoverClubs, search),
    }),
    [ownClubs, joinedClubs, discoverClubs, search]
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium text-foreground">Clubs</h1>
        <p className="text-sm text-muted-foreground">Create and manage activity clubs for the yaaro community</p>
      </div>

      <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as string)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* <Tabs.List className="flex gap-6 overflow-x-auto overflow-y-hidden border-b border-border">
            <Tabs.Tab value="own" className={tabClassName}>
              My Clubs ({ownClubs.length})
            </Tabs.Tab>
            <Tabs.Tab value="joined" className={tabClassName}>
              Joined ({joinedClubs.length})
            </Tabs.Tab>
            <Tabs.Tab value="discover" className={tabClassName}>
              Discover
            </Tabs.Tab>
          </Tabs.List> */}
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search clubs"
              className="h-9 w-full pl-9"
            />
          </div>
          <Button size="lg" nativeButton={false} render={<Link href="/clubs/new" />}>
            <Plus />
            Create Club
          </Button>
        </div>

        <Tabs.Panel value="own" className="pt-6">
          <ClubsTable
            clubs={filtered.own}
            emptyDescription="Create your first club to get started."
          />
        </Tabs.Panel>
        {/* <Tabs.Panel value="joined" className="pt-6">
          <ClubsTable
            clubs={filtered.joined}
            emptyDescription="Clubs you join from Discover show up here."
          />
        </Tabs.Panel>
        <Tabs.Panel value="discover" className="pt-6">
          <ClubsTable
            clubs={filtered.discover}
            emptyDescription="There are no other public clubs to join right now."
          />
        </Tabs.Panel> */}
      </Tabs.Root>
    </div>
  );
}
