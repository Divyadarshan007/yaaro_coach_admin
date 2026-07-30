import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { AvatarInfo } from "@/features/clients/types/client";

type PersonAvatarProps = {
  avatar: AvatarInfo;
  size?: "default" | "sm" | "lg";
  className?: string;
};

export function PersonAvatar({ avatar, size = "default", className }: PersonAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className={cn(avatar.colorClassName)}>{avatar.initials}</AvatarFallback>
    </Avatar>
  );
}
