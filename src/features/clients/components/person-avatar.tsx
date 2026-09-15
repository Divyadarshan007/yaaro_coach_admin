import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { AvatarInfo } from "@/features/clients/types/client";

type PersonAvatarProps = {
  avatar: AvatarInfo;
  // Overrides avatar.imageUrl when the caller has a photo source the AvatarInfo itself
  // doesn't carry (e.g. team.ts rows, which return a bare url string alongside name/id
  // rather than a full AvatarInfo). Falls back to the initials below while it loads or
  // if it's absent/broken.
  imageUrl?: string;
  size?: "default" | "sm" | "lg";
  className?: string;
};

export function PersonAvatar({
  avatar,
  imageUrl,
  size = "default",
  className,
}: PersonAvatarProps) {
  const src = imageUrl ?? avatar.imageUrl;
  return (
    <Avatar size={size} className={className}>
      {src && <AvatarImage src={src} alt={avatar.name} />}
      <AvatarFallback className={cn(avatar.colorClassName)}>
        {avatar.initials}
      </AvatarFallback>
    </Avatar>
  );
}
