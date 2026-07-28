"use client";

import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { SidebarLogo } from "@/components/layout/sidebar-logo";
import { SidebarSearch } from "@/components/layout/sidebar-search";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { TrialBanner } from "@/components/layout/trial-banner";
import { useSidebarStore } from "@/stores/sidebar-store";
import { cn } from "@/lib/utils";

type SidebarContentProps = {
  collapsed?: boolean;
  showCollapseToggle?: boolean;
};

export function SidebarContent({ collapsed = false, showCollapseToggle = false }: SidebarContentProps) {
  const toggleDesktopCollapsed = useSidebarStore((state) => state.toggleDesktopCollapsed);

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-6 bg-sidebar text-sidebar-foreground",
        collapsed ? "items-center px-2 py-4" : "p-4"
      )}
    >
      <div className={cn("flex w-full items-center gap-2", collapsed ? "flex-col" : "justify-between")}>
        <SidebarLogo collapsed={collapsed} />
        {showCollapseToggle && (
          <button
            type="button"
            onClick={toggleDesktopCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex size-7 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
          >
            {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          </button>
        )}
      </div>
      {!collapsed && <SidebarSearch />}
      <div className="w-full min-h-0 flex-1 overflow-y-auto">
        <SidebarNav collapsed={collapsed} />
      </div>
      {!collapsed && (
        <>
          <Separator className="bg-sidebar-border" />
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm">
              <a href="#" className="text-primary transition-opacity hover:opacity-80">
                Feedback
              </a>
              <span className="text-sidebar-foreground/30">|</span>
              <a href="#" className="text-primary transition-opacity hover:opacity-80">
                Help
              </a>
            </div>
            <TrialBanner />
          </div>
        </>
      )}
    </div>
  );
}
