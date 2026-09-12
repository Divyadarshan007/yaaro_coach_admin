"use client";

import { Tabs } from "@base-ui/react/tabs";
import Link from "next/link";
import { ArrowLeft, Globe, Lock, Users } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { ClubJoinRequestsTab } from "@/features/clubs/components/club-join-requests-tab";
import { ClubMembersTab } from "@/features/clubs/components/club-members-tab";
import { ClubOverviewTab } from "@/features/clubs/components/club-overview-tab";
import { ClubStatsTab } from "@/features/clubs/components/club-stats-tab";
import type { Club, ClubJoinRequest, ClubMember } from "@/features/clubs/types/club";

const tabClassName =
  "relative -mb-px border-b-2 border-transparent px-1 pb-3 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors hover:text-foreground data-active:border-primary data-active:text-foreground";

export function ClubDetailView({
  club,
  members,
  joinRequests,
}: {
  club: Club;
  members: ClubMember[];
  joinRequests: ClubJoinRequest[];
}) {
  const [activeTab, setActiveTab] = useState("members");
  // Join requests only apply to private clubs — a public club can be joined directly,
  // so there's nothing to approve.
  const showRequestsTab = club.isOwner && club.visibility === "private";

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/clubs"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Clubs
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
          {club.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={club.imageUrl} alt="" className="size-full object-cover" />
          ) : (
            <Users className="size-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-medium text-foreground">{club.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="gap-1">
              {club.visibility === "private" ? <Lock /> : <Globe />}
              {club.visibility === "private" ? "Private" : "Public"}
            </Badge>
            <span>
              {club.memberCount} member{club.memberCount === 1 ? "" : "s"}
            </span>
            {!club.isOwner && <span>· You are {club.isMember ? "a member" : "not a member"}</span>}
          </div>
        </div>
      </div>

      <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as string)}>
        <Tabs.List className="flex gap-6 overflow-x-auto overflow-y-hidden border-b border-border">
          <Tabs.Tab value="members" className={tabClassName}>
            Members ({members.length})
          </Tabs.Tab>
          {showRequestsTab && (
            <Tabs.Tab value="requests" className={tabClassName}>
              Requests ({joinRequests.length})
            </Tabs.Tab>
          )}
          <Tabs.Tab value="stats" className={tabClassName}>
            Stats
          </Tabs.Tab>
          <Tabs.Tab value="overview" className={tabClassName}>
            {club.isOwner ? "Settings" : "Overview"}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="members" className="pt-6">
          <ClubMembersTab members={members} />
        </Tabs.Panel>
        {showRequestsTab && (
          <Tabs.Panel value="requests" className="pt-6">
            <ClubJoinRequestsTab clubId={club.id} requests={joinRequests} />
          </Tabs.Panel>
        )}
        <Tabs.Panel value="stats" className="pt-6">
          <ClubStatsTab clubId={club.id} />
        </Tabs.Panel>
        <Tabs.Panel value="overview" className="pt-6">
          <ClubOverviewTab club={club} />
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
