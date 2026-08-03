import type { LucideIcon } from "lucide-react";
import {
  Dumbbell,
  FolderOpen,
  LayoutGrid,
  Rocket,
  Settings,
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
  { id: "grow", label: "Grow", href: "/grow", icon: Rocket },
  { id: "settings", label: "Settings", href: "#", icon: Settings, disabled: true },
  { id: "team", label: "Team", href: "#", icon: UsersRound, disabled: true },
];
