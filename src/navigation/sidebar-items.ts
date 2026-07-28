import type { LucideIcon } from "lucide-react";
import {
  Dumbbell,
  FolderOpen,
  LayoutGrid,
  MessageSquare,
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
  { id: "clients", label: "Clients", href: "#", icon: Users, disabled: true },
  {
    id: "program-library",
    label: "Program Library",
    href: "#",
    icon: FolderOpen,
    disabled: true,
  },
  {
    id: "exercise-library",
    label: "Exercise Library",
    href: "#",
    icon: Dumbbell,
    disabled: true,
  },
  { id: "chat", label: "Chat", href: "#", icon: MessageSquare, disabled: true },
  { id: "grow", label: "Grow", href: "#", icon: Rocket, disabled: true },
  { id: "settings", label: "Settings", href: "#", icon: Settings, disabled: true },
  { id: "team", label: "Team", href: "#", icon: UsersRound, disabled: true },
];
