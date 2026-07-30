import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileTopbar } from "@/components/layout/mobile-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={{ "--sidebar-width": "20rem", "--sidebar-width-icon": "5rem" } as React.CSSProperties}
      className="h-screen"
    >
      <AppSidebar />
      <SidebarInset className="flex h-screen min-h-0 flex-col overflow-hidden">
        <MobileTopbar />
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
