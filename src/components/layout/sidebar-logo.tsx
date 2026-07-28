import Image from "next/image";
import Link from "next/link";

export function SidebarLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 px-1">
      <Image
        src="/yaaro-icon.png"
        alt="Yaaro Coach"
        width={36}
        height={36}
        priority
        className="size-9 shrink-0 object-contain"
      />
      {!collapsed && <span className="text-base font-semibold text-sidebar-foreground">Yaaro Coach</span>}
    </Link>
  );
}
