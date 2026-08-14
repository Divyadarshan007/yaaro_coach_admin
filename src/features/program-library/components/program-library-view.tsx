"use client";

import { Tabs } from "@base-ui/react/tabs";
import { useEffect, useRef, useState } from "react";

import { ExploreEmptyState } from "@/features/program-library/components/explore-empty-state";
import { ExploreProgramList } from "@/features/program-library/components/explore-program-list";
import { MyLibraryProgramList } from "@/features/program-library/components/my-library-program-list";
import { MyRoutinesList } from "@/features/program-library/components/my-routines-list";
import { ProgramLibraryEmptyState } from "@/features/program-library/components/program-library-empty-state";
import { RoutineLibraryEmptyState } from "@/features/program-library/components/routine-library-empty-state";
import { ProgramLibraryToolbar } from "@/features/program-library/components/program-library-toolbar";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import { useMyRoutinesStore } from "@/features/program-editor/store/my-routines-store";
import type { Program, Routine } from "@/features/program-editor/types/program-editor";

type LibraryTab = "my-library" | "my-routines" | "explore";

const tabClassName =
  "relative -mb-px border-b-2 border-transparent px-1 pb-3 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors hover:text-foreground data-active:border-primary data-active:text-foreground";

export function ProgramLibraryView({
  initialPrograms,
  initialRoutines,
  explorePrograms,
}: {
  initialPrograms: Program[];
  initialRoutines: Routine[];
  explorePrograms: Program[];
}) {
  const [activeTab, setActiveTab] = useState<LibraryTab>("my-library");
  const hydratePrograms = useMyProgramsStore((state) => state.hydratePrograms);
  const hasPrograms = useMyProgramsStore((state) => state.programs.length > 0);
  const hydrateRoutines = useMyRoutinesStore((state) => state.hydrateRoutines);
  const hasRoutines = useMyRoutinesStore((state) => state.routines.length > 0);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;
    hydratePrograms(initialPrograms);
    hydrateRoutines(initialRoutines);
  }, [hydratePrograms, initialPrograms, hydrateRoutines, initialRoutines]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Program Library</h1>
        <p className="text-sm text-muted-foreground">Organize all your programs and routines</p>
      </div>

      <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as LibraryTab)}>
        <Tabs.List className="flex gap-6 border-b border-border">
          <Tabs.Tab value="my-library" className={tabClassName}>
            My Library
          </Tabs.Tab>
          <Tabs.Tab value="my-routines" className={tabClassName}>
            My Routines
          </Tabs.Tab>
          <Tabs.Tab value="explore" className={tabClassName}>
            Explore
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="my-library" className="flex flex-col gap-4 pt-6">
          <ProgramLibraryToolbar />
          {hasPrograms ? <MyLibraryProgramList /> : <ProgramLibraryEmptyState />}
        </Tabs.Panel>

        <Tabs.Panel value="my-routines" className="flex flex-col gap-4 pt-6">
          {hasRoutines ? <MyRoutinesList /> : <RoutineLibraryEmptyState />}
        </Tabs.Panel>

        <Tabs.Panel value="explore" className="flex flex-col gap-4 pt-6">
          {explorePrograms.length > 0 ? <ExploreProgramList programs={explorePrograms} /> : <ExploreEmptyState />}
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
