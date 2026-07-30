"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { CoachProfileMenu } from "@/components/layout/coach-profile-menu";
import { SidebarLogo } from "@/components/layout/sidebar-logo";
import { SidebarSearch } from "@/components/layout/sidebar-search";
import { sidebarNavItems } from "@/navigation/sidebar-items";
import { cn } from "@/lib/utils";
import type { CoachProfile } from "@/lib/api/coach";

export function AppSidebar({ coachProfile }: { coachProfile: CoachProfile | null }) {
  const { state, isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const collapsed = state === "collapsed" && !isMobile;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-4 p-4">
        <div className={cn("flex w-full items-center gap-2", collapsed ? "flex-col" : "justify-between")}>
          <SidebarLogo collapsed={collapsed} />
          {!isMobile && (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex size-7 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
            >
              {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
            </button>
          )}
        </div>
        {!collapsed && <SidebarSearch />}
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {sidebarNavItems.map((item) => {
            const isActive = !item.disabled && pathname === item.href;
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.label}
                  render={
                    <Link
                      href={item.href}
                      aria-disabled={item.disabled}
                      aria-current={isActive ? "page" : undefined}
                      tabIndex={item.disabled ? -1 : undefined}
                      onClick={(event) => {
                        if (item.disabled) event.preventDefault();
                      }}
                    />
                  }
                >
                  <Icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="gap-4 p-4">
          <Separator className="bg-sidebar-border" />
          <CoachProfileMenu coach={coachProfile} />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
