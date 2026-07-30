"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { YaaroCoachCategorySidebar } from "@/features/program-library/components/yaaro-coach-category-sidebar";
import { YaaroCoachProgramCard } from "@/features/program-library/components/yaaro-coach-program-card";
import { YaaroCoachProgramDetailsDialog } from "@/features/program-library/components/yaaro-coach-program-details-dialog";
import type { YaaroCoachLibraryCategoryId, YaaroCoachProgram } from "@/features/program-library/types/yaaro-coach-library";

export function YaaroCoachLibraryPanel({ templates }: { templates: YaaroCoachProgram[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<YaaroCoachLibraryCategoryId>("all");

  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return templates.filter((program) => {
      const matchesCategory = activeCategory === "all" || program.categories.includes(activeCategory);
      const matchesSearch = query.length === 0 || program.title.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [templates, search, activeCategory]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search templates"
          className="h-9 w-full pl-9"
        />
      </div>

      <div className="flex flex-col gap-6 sm:flex-row">
        <YaaroCoachCategorySidebar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

        <div className="flex flex-1 flex-col gap-4">
          {filteredPrograms.length === 0 ? (
            <div className="flex min-h-105 flex-col items-center justify-center gap-1 rounded-xl bg-card p-6 text-center ring-1 ring-foreground/10">
              <h2 className="text-base font-semibold text-foreground">No Templates Found</h2>
              <p className="text-sm text-muted-foreground">Browse ready-made programs from Yaaro Coach and add them to your library.</p>
            </div>
          ) : (
            filteredPrograms.map((program) => <YaaroCoachProgramCard key={program.id} program={program} />)
          )}
        </div>
      </div>

      <YaaroCoachProgramDetailsDialog templates={templates} />
    </div>
  );
}
