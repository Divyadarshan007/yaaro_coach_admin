"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarLogo } from "@/components/layout/sidebar-logo";
import { useSidebarStore } from "@/stores/sidebar-store";

export function MobileTopbar() {
  const open = useSidebarStore((state) => state.open);

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 bg-sidebar px-4 py-3 lg:hidden">
      <SidebarLogo />
      <Button
        variant="ghost"
        size="icon"
        className="text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
        onClick={open}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>
    </div>
  );
}
