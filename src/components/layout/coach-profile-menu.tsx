"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { avatarFromName } from "@/features/clients/lib/avatar";
import type { CoachProfile } from "@/lib/api/coach";

export function CoachProfileMenu({ coach }: { coach: CoachProfile | null }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const avatar = avatarFromName(coach?.name || coach?.email || "Coach", coach?.id ?? "coach");

  async function handleLogout() {
    setIsLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg p-1.5 text-left transition-colors hover:bg-sidebar-foreground/10"
          />
        }
      >
        <Avatar size="sm">
          {coach?.avatar && <AvatarImage src={coach.avatar} alt={avatar.name} />}
          <AvatarFallback className={avatar.colorClassName}>{avatar.initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-sidebar-foreground">{coach?.name || "Coach"}</p>
          {coach?.email && <p className="truncate text-xs text-sidebar-foreground/60">{coach.email}</p>}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem variant="destructive" onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
