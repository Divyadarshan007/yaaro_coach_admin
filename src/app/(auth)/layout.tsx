import Image from "next/image";
import Link from "next/link";

import { AuthPageTransition } from "@/features/auth/components/auth-page-transition";

// Shared shell for /login and /signup — the hero image/branding stays mounted across
// navigation between the two; only the form card inside (children) animates.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="sticky top-0 hidden h-screen w-1/2 overflow-hidden lg:block">
        <Image
          src="/images/signup-hero-runner.jpg"
          alt="A runner sprinting on a track at golden hour"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/30" />

        <Link href="/" className="absolute top-10 left-10 flex items-center gap-2">
          <Image src="/yaaro-icon.png" alt="Yaaro Studio" width={36} height={36} priority className="size-9" />
          <span className="text-base font-semibold text-white">Yaaro Studio</span>
        </Link>

        <div className="absolute right-10 bottom-10 left-10">
          <h2 className="text-3xl font-semibold leading-tight text-white text-balance">
            Run your coaching studio like a pro.
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Batches, attendance and billing, all in one place.
          </p>
        </div>
      </aside>

      <main className="flex w-full flex-col lg:w-1/2">
        <header className="flex items-center gap-2 border-b border-border px-6 py-4 lg:hidden">
          <Image src="/yaaro-icon.png" alt="Yaaro Studio" width={36} height={36} priority className="size-9" />
          <span className="text-base font-semibold text-foreground">Yaaro Studio</span>
        </header>

        <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6">
          <AuthPageTransition>{children}</AuthPageTransition>
        </div>
      </main>
    </div>
  );
}
