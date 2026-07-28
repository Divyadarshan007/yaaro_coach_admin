"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function SidebarSearch({ className }: { className?: string }) {
  const [value, setValue] = useState("");

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-sidebar-foreground/50" />
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-9 w-full rounded-lg border border-sidebar-border bg-sidebar-foreground/5 pl-9 pr-3 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/50 outline-none transition-colors focus-visible:border-primary"
      />
    </div>
  );
}
