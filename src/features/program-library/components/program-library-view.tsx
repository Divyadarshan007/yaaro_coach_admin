"use client";

import { Tabs } from "@base-ui/react/tabs";
import { useEffect, useRef, useState } from "react";

import { YaaroCoachLibraryPanel } from "@/features/program-library/components/yaaro-coach-library-panel";
import { MyLibraryProgramList } from "@/features/program-library/components/my-library-program-list";
import { ProgramLibraryEmptyState } from "@/features/program-library/components/program-library-empty-state";
import { ProgramLibraryToolbar } from "@/features/program-library/components/program-library-toolbar";
import type { YaaroCoachProgram } from "@/features/program-library/types/yaaro-coach-library";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import type { Program } from "@/features/program-editor/types/program-editor";

type LibraryTab = "my-library" | "yaaro-coach-library";

const tabClassName =
  "relative -mb-px border-b-2 border-transparent px-1 pb-3 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors hover:text-foreground data-active:border-primary data-active:text-foreground";

export function ProgramLibraryView({
  templates,
  initialPrograms,
}: {
  templates: YaaroCoachProgram[];
  initialPrograms: Program[];
}) {
  const [activeTab, setActiveTab] = useState<LibraryTab>("my-library");
  const hydratePrograms = useMyProgramsStore((state) => state.hydratePrograms);
  const hasAddedPrograms = useMyProgramsStore((state) => state.programs.length > 0);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;
    hydratePrograms(initialPrograms);
  }, [hydratePrograms, initialPrograms]);

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
          <Tabs.Tab value="yaaro-coach-library" className={tabClassName}>
            Yaaro Coach Library
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="my-library" className="flex flex-col gap-4 pt-6">
          <ProgramLibraryToolbar />
          {hasAddedPrograms ? (
            <MyLibraryProgramList />
          ) : (
            <ProgramLibraryEmptyState onBrowseTemplates={() => setActiveTab("yaaro-coach-library")} />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="yaaro-coach-library" className="pt-6">
          <YaaroCoachLibraryPanel templates={templates} />
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
