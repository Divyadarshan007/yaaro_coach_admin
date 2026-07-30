"use client";

import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBlankProgramAction } from "@/features/program-editor/actions";

export function ProgramLibraryToolbar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  function handleCreateProgram() {
    startTransition(async () => {
      const id = await createBlankProgramAction();
      router.push(`/program/${id}`);
    });
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative sm:max-w-sm sm:flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search programs"
          className="h-9 w-full pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button size="lg" onClick={handleCreateProgram} disabled={isPending}>
          <Plus />
          Create Workout Program
        </Button>
      </div>
    </div>
  );
}
