"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Gates navigating away behind the UnsavedChangesDialog while there are unsaved edits.
// `onLeave` (optional) fires exactly once, right as the user actually leaves —
// immediately when not dirty, or on confirming the dialog when dirty — e.g. to clean up
// a draft that was never saved. Navigation always waits for `onLeave` to finish (it may
// return a Promise) before actually moving to the destination, so a discard/delete
// that's still in flight can't race the next page's own data fetch and get undone by it.
//
// `requestLeave` covers this page's own explicit "Back" link. A document-level click
// guard (below) additionally covers every other in-app link click while this page is
// mounted — sidebar tabs, breadcrumbs, anything else with an <a href> — since Next's App
// Router has no router-level navigation-block API to catch those otherwise.
export function useLeaveConfirmation(isDirty: boolean, onLeave?: () => void | Promise<void>) {
  const router = useRouter();
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const isDirtyRef = useRef(isDirty);
  const onLeaveRef = useRef(onLeave);
  useEffect(() => {
    isDirtyRef.current = isDirty;
    onLeaveRef.current = onLeave;
  });

  function leave(href: string) {
    if (!isDirtyRef.current) {
      void Promise.resolve(onLeaveRef.current?.()).then(() => router.push(href));
      return;
    }
    setPendingHref(href);
  }

  function requestLeave(event: React.MouseEvent, href: string) {
    event.preventDefault();
    leave(href);
  }

  function cancel() {
    setPendingHref(null);
  }

  function confirmLeave() {
    const href = pendingHref;
    setPendingHref(null);
    void Promise.resolve(onLeaveRef.current?.()).then(() => {
      if (href) router.push(href);
    });
  }

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a[href]");
      if (!anchor || anchor.getAttribute("aria-disabled") === "true") return;
      if (anchor.hasAttribute("download") || anchor.getAttribute("target") === "_blank") return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || url.pathname === pathname) return;

      event.preventDefault();
      leave(url.pathname + url.search + url.hash);
    }

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
    // `leave` reads isDirty/onLeave through refs, so it doesn't need to be a dep here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return { isConfirmOpen: pendingHref !== null, requestLeave, cancel, confirmLeave };
}
