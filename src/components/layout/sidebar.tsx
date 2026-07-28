"use client";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/layout/sidebar-content";
import { MobileTopbar } from "@/components/layout/mobile-topbar";
import { useSidebarStore } from "@/stores/sidebar-store";
import { cn } from "@/lib/utils";

export function SidebarShell() {
  const isMobileOpen = useSidebarStore((state) => state.isMobileOpen);
  const close = useSidebarStore((state) => state.close);
  const isDesktopCollapsed = useSidebarStore((state) => state.isDesktopCollapsed);

  return (
    <>
      <aside
        className={cn(
          "hidden h-full shrink-0 border-r border-sidebar-border transition-[width] duration-200 lg:block",
          isDesktopCollapsed ? "w-20" : "w-80"
        )}
      >
        <SidebarContent collapsed={isDesktopCollapsed} showCollapseToggle />
      </aside>

      <MobileTopbar />

      <Sheet open={isMobileOpen} onOpenChange={(open) => !open && close()}>
        <SheetContent side="left" className="border-sidebar-border p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Yaaro Coach navigation menu</SheetDescription>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
