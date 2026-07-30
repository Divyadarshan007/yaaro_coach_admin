"use client";

import { Tabs } from "@base-ui/react/tabs";
import {
  BarChart3,
  ClipboardList,
  Image as ImageIcon,
  LineChart,
  Ruler,
  Settings as SettingsIcon,
} from "lucide-react";
import { useState } from "react";

import { ClientDetailHeader } from "@/features/clients/components/detail/client-detail-header";
import { ClientOverviewTab } from "@/features/clients/components/detail/client-overview-tab";
import { ClientPlaceholderTab } from "@/features/clients/components/detail/client-placeholder-tab";
import type { ClientDetail } from "@/features/clients/types/client-detail";

const PLACEHOLDER_TABS = [
  { value: "workout-program", label: "Workout Program", icon: ClipboardList },
  { value: "exercise-statistics", label: "Exercise Statistics", icon: BarChart3 },
  { value: "advanced-statistics", label: "Advanced Statistics", icon: LineChart },
  { value: "body-measurements", label: "Body Measurements", icon: Ruler },
  { value: "progress-pictures", label: "Progress Pictures", icon: ImageIcon },
  { value: "settings", label: "Settings", icon: SettingsIcon },
] as const;

const tabClassName =
  "relative -mb-px border-b-2 border-transparent px-1 pb-3 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors hover:text-foreground data-active:border-primary data-active:text-foreground";

export function ClientDetailView({ client }: { client: ClientDetail }) {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="flex flex-col gap-6">
      <ClientDetailHeader client={client} />

      <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as string)}>
        <Tabs.List className="flex gap-6 overflow-x-auto border-b border-border">
          <Tabs.Tab value="overview" className={tabClassName}>
            Overview
          </Tabs.Tab>
          {PLACEHOLDER_TABS.map((tab) => (
            <Tabs.Tab key={tab.value} value={tab.value} className={tabClassName}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value="overview" className="pt-6">
          <ClientOverviewTab client={client} />
        </Tabs.Panel>

        {PLACEHOLDER_TABS.map((tab) => (
          <Tabs.Panel key={tab.value} value={tab.value} className="pt-6">
            <ClientPlaceholderTab icon={tab.icon} title={tab.label} />
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  );
}
