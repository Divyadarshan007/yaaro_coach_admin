import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileTopbar } from "@/components/layout/mobile-topbar";
import { PageTransition } from "@/components/layout/page-transition";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getCoachProfile } from "@/lib/api/coach";
import { getPendingLeadsCount } from "@/lib/api/leads";
import { getExerciseCatalog } from "@/lib/api/exercises";
import { ExerciseCatalogHydrator } from "@/lib/exercise-catalog-hydrator";
import { SubscriptionRequiredDialog } from "@/components/subscription-required-dialog";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const [coachProfile, pendingLeadsCount, exerciseCatalog] = await Promise.all([
    getCoachProfile(),
    getPendingLeadsCount(),
    getExerciseCatalog(),
  ]);

  // getCoachProfile() returns null when the session cookie is missing/expired, or
  // points at a coach token the backend can no longer resolve (401/404) — in every
  // one of those cases the right move is a fresh login, not the generic error page
  // every other fetch in this tree (e.g. dashboard stats) would otherwise throw into.
  if (!coachProfile) {
    redirect("/login");
  }

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "20rem", "--sidebar-width-icon": "5rem" } as React.CSSProperties}
      className="h-screen"
    >
      <ExerciseCatalogHydrator catalog={exerciseCatalog} />
      <SubscriptionRequiredDialog />
      <AppSidebar coachProfile={coachProfile} badgeCounts={{ grow: pendingLeadsCount }} />
      <SidebarInset className="flex h-screen min-h-0 flex-col overflow-hidden">
        <MobileTopbar />
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
