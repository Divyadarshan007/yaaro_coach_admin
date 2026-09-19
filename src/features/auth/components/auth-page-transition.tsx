"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

// Same "fade/slide in, no exit wait" approach as components/layout/page-transition.tsx —
// keyed by pathname so switching between /login and /signup re-triggers it, without an
// AnimatePresence exit that would delay the new page showing up.
export function AuthPageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
