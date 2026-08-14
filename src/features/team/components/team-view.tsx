"use client";

import { Tabs } from "@base-ui/react/tabs";
import { useState } from "react";

import { MembersTab } from "@/features/team/components/members-tab";
import { TeamSettingsTab } from "@/features/team/components/team-settings-tab";
import type { Team } from "@/features/team/types/team";

const tabClassName =
  "relative -mb-px border-b-2 border-transparent px-1 pb-3 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors hover:text-foreground data-active:border-primary data-active:text-foreground";

export function TeamView({ team }: { team: Team }) {
  const [activeTab, setActiveTab] = useState<string>("members");

  return (
    <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as string)}>
      <Tabs.List className="flex gap-6 overflow-x-auto border-b border-border">
        <Tabs.Tab value="members" className={tabClassName}>
          Members
        </Tabs.Tab>
        <Tabs.Tab value="settings" className={tabClassName}>
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="members" className="pt-6">
        <MembersTab team={team} />
      </Tabs.Panel>

      <Tabs.Panel value="settings" className="pt-6">
        <TeamSettingsTab team={team} />
      </Tabs.Panel>
    </Tabs.Root>
  );
}
