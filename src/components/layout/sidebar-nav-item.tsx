"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/navigation/sidebar-items";
import { cn } from "@/lib/utils";

export function SidebarNavItem({ item, collapsed = false }: { item: NavItem; collapsed?: boolean }) {
  const pathname = usePathname();
  const isActive = !item.disabled && pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      aria-disabled={item.disabled}
      aria-current={isActive ? "page" : undefined}
      tabIndex={item.disabled ? -1 : undefined}
      onClick={(event) => {
        if (item.disabled) event.preventDefault();
      }}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-2",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : item.disabled
            ? "text-sidebar-foreground/40 cursor-default"
            : "text-sidebar-foreground/80 hover:bg-sidebar-foreground/5 hover:text-sidebar-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && item.label}
    </Link>
  );
}
