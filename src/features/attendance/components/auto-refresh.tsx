"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Re-runs the Attendance server component on an interval so new check-ins appear
// without the coach reloading the page. Pauses while the tab is hidden.
export function AutoRefresh({ intervalMs = 15000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const id = setInterval(tick, intervalMs);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [router, intervalMs]);

  return null;
}
