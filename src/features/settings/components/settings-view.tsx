"use client";

import { Tabs } from "@base-ui/react/tabs";
import { useState } from "react";

import { NotificationsTab } from "@/features/settings/components/notifications-tab";
import { PreferencesTab } from "@/features/settings/components/preferences-tab";
import { ProfileTab } from "@/features/settings/components/profile-tab";
import type { ClientSummary } from "@/features/clients/types/client";
import type { CoachProfile } from "@/lib/api/coach";

const tabClassName =
  "relative -mb-px border-b-2 border-transparent px-1 pb-3 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors hover:text-foreground data-active:border-primary data-active:text-foreground";

export function SettingsView({
  coachProfile,
  clients,
}: {
  coachProfile: CoachProfile | null;
  clients: ClientSummary[];
}) {
  const [activeTab, setActiveTab] = useState<string>("profile");

  return (
    <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as string)}>
      <Tabs.List className="flex gap-6 overflow-x-auto overflow-y-hidden border-b border-border">
        <Tabs.Tab value="profile" className={tabClassName}>
          Profile
        </Tabs.Tab>
        <Tabs.Tab value="notifications" className={tabClassName}>
          Notifications
        </Tabs.Tab>
        <Tabs.Tab value="preferences" className={tabClassName}>
          Preferences
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="profile" className="pt-6">
        <ProfileTab coachProfile={coachProfile} />
      </Tabs.Panel>

      <Tabs.Panel value="notifications" className="pt-6">
        <NotificationsTab clients={clients} />
      </Tabs.Panel>

      <Tabs.Panel value="preferences" className="pt-6">
        <PreferencesTab coachProfile={coachProfile} />
      </Tabs.Panel>
    </Tabs.Root>
  );
}
