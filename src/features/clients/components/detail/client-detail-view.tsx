"use client";

import { Tabs } from "@base-ui/react/tabs";
import { useState } from "react";

import { ClientAdvancedStatisticsTab } from "@/features/clients/components/detail/client-advanced-statistics-tab";
import { ClientBodyMeasurementsTab } from "@/features/clients/components/detail/client-body-measurements-tab";
import { ClientDetailHeader } from "@/features/clients/components/detail/client-detail-header";
import { ClientExerciseStatisticsTab } from "@/features/clients/components/detail/client-exercise-statistics-tab";
import { ClientOverviewTab } from "@/features/clients/components/detail/client-overview-tab";
import { ClientProgressPicturesTab } from "@/features/clients/components/detail/client-progress-pictures-tab";
import { ClientSettingsTab } from "@/features/clients/components/detail/client-settings-tab";
import { ClientWorkoutProgramTab } from "@/features/clients/components/detail/client-workout-program-tab";
import type { ClientDetail } from "@/features/clients/types/client-detail";
import type { ClientMeasurement } from "@/features/clients/types/measurement";
import type { FeedItem } from "@/features/clients/types/workout-feed";
import type { ExerciseCatalogEntry } from "@/lib/api/exercises";
import type { Program } from "@/features/program-editor/types/program-editor";
import type { TeamMember } from "@/features/team/types/team";

const tabClassName =
  "relative -mb-px border-b-2 border-transparent px-1 pb-3 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors hover:text-foreground data-active:border-primary data-active:text-foreground";

export function ClientDetailView({
  client,
  libraryPrograms,
  activeProgram,
  initialFeeds,
  exerciseCatalog,
  initialMeasurements,
  teamMembers,
}: {
  client: ClientDetail;
  libraryPrograms: Program[];
  activeProgram: Program | null;
  initialFeeds: FeedItem[];
  exerciseCatalog: ExerciseCatalogEntry[];
  initialMeasurements: ClientMeasurement[];
  teamMembers: TeamMember[];
}) {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="flex flex-col gap-6">
      <ClientDetailHeader client={client} />

      <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as string)}>
        <Tabs.List className="flex gap-6 overflow-x-auto overflow-y-hidden border-b border-border">
          <Tabs.Tab value="overview" className={tabClassName}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="workout-program" className={tabClassName}>
            Workout Program
          </Tabs.Tab>
          <Tabs.Tab value="exercise-statistics" className={tabClassName}>
            Exercise Statistics
          </Tabs.Tab>
          <Tabs.Tab value="advanced-statistics" className={tabClassName}>
            Advanced Statistics
          </Tabs.Tab>
          <Tabs.Tab value="body-measurements" className={tabClassName}>
            Body Measurements
          </Tabs.Tab>
          <Tabs.Tab value="progress-pictures" className={tabClassName}>
            Progress Pictures
          </Tabs.Tab>
          <Tabs.Tab value="settings" className={tabClassName}>
            Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" className="pt-6">
          <ClientOverviewTab client={client} libraryPrograms={libraryPrograms} teamMembers={teamMembers} />
        </Tabs.Panel>

        <Tabs.Panel value="workout-program" className="pt-6">
          <ClientWorkoutProgramTab
            client={client}
            libraryPrograms={libraryPrograms}
            activeProgram={activeProgram}
            initialFeeds={initialFeeds}
          />
        </Tabs.Panel>

        <Tabs.Panel value="exercise-statistics" className="pt-6">
          <ClientExerciseStatisticsTab catalog={exerciseCatalog} initialFeeds={initialFeeds} />
        </Tabs.Panel>

        <Tabs.Panel value="advanced-statistics" className="pt-6">
          <ClientAdvancedStatisticsTab clientId={client.id} />
        </Tabs.Panel>

        <Tabs.Panel value="body-measurements" className="pt-6">
          <ClientBodyMeasurementsTab measurements={initialMeasurements} />
        </Tabs.Panel>

        <Tabs.Panel value="progress-pictures" className="pt-6">
          <ClientProgressPicturesTab clientId={client.id} measurements={initialMeasurements} />
        </Tabs.Panel>

        <Tabs.Panel value="settings" className="pt-6">
          <ClientSettingsTab client={client} />
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
