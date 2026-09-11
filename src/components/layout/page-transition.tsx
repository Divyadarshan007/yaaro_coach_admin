"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

// A plain fade-in on route change, keyed by path. No exit animation and no
// AnimatePresence "wait" — the new page starts rendering and fading in right away
// instead of waiting on the old page's exit, which is what made the earlier
// crossfade version feel like it added a delay to every navigation.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      // Pages like the routine editor rely on a h-full chain from <main> down to their
      // own internally-scrolling panels — without flex/h-full/min-h-0 here, this wrapper
      // has no definite height for that chain to resolve against, and those panels fall
      // back to growing with their content instead of scrolling internally.
      className="flex h-full min-h-0 flex-col"
    >
      {children}
    </motion.div>
  );
}
