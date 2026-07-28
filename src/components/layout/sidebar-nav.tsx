import { sidebarNavItems } from "@/navigation/sidebar-items";
import { SidebarNavItem } from "@/components/layout/sidebar-nav-item";

export function SidebarNav({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <nav className="flex flex-col gap-1">
      {sidebarNavItems.map((item) => (
        <SidebarNavItem key={item.id} item={item} collapsed={collapsed} />
      ))}
    </nav>
  );
}
