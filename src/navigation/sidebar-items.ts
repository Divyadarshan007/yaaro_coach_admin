import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarClock,
  CreditCard,
  Dumbbell,
  FolderOpen,
  LayoutGrid,
  QrCode,
  // Rocket, // Grow — hidden for now
  Settings,
  Shield,
  UserPlus,
  Users,
  UsersRound,
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export const sidebarNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { id: "clients", label: "Clients", href: "/clients", icon: Users },
  {
    id: "program-library",
    label: "Program Library",
    href: "/program-library",
    icon: FolderOpen,
  },
  {
    id: "exercise-library",
    label: "Exercise Library",
    href: "/exercise-library",
    icon: Dumbbell,
  },
  { id: "team", label: "Team", href: "/team", icon: UsersRound },
  { id: "studio", label: "Studio", href: "/studio", icon: Building2 },
  { id: "batch", label: "Batch", href: "/batch", icon: CalendarClock },
  { id: "attendance", label: "Attendance", href: "/attendance", icon: QrCode },
  {
    id: "membership-plan",
    label: "Membership Plan",
    href: "/membership-plan",
    icon: CreditCard,
  },
  { id: "clubs", label: "Clubs", href: "/clubs", icon: Shield },
  { id: "leads", label: "Leads", href: "/leads", icon: UserPlus },
  // Grow tab hidden for now — route (/grow) still exists, just not linked in the sidebar.
  // { id: "grow", label: "Grow", href: "/grow", icon: Rocket },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];
