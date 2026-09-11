"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Gates a "Back" link behind the UnsavedChangesDialog while there are unsaved edits —
// pass the click event + destination to `requestLeave`. `onLeave` (optional) fires
// exactly once, right as the user actually leaves — immediately when not dirty, or on
// confirming the dialog when dirty — e.g. to clean up a draft that was never saved.
// Navigation always waits for `onLeave` to finish (it may return a Promise) before
// actually moving to the destination, so a discard/delete that's still in flight can't
// race the next page's own data fetch and get undone by it.
export function useLeaveConfirmation(isDirty: boolean, onLeave?: () => void | Promise<void>) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  function requestLeave(event: React.MouseEvent, href: string) {
    event.preventDefault();
    if (!isDirty) {
      void Promise.resolve(onLeave?.()).then(() => router.push(href));
      return;
    }
    setPendingHref(href);
  }

  function cancel() {
    setPendingHref(null);
  }

  function confirmLeave() {
    const href = pendingHref;
    setPendingHref(null);
    void Promise.resolve(onLeave?.()).then(() => {
      if (href) router.push(href);
    });
  }

  return { isConfirmOpen: pendingHref !== null, requestLeave, cancel, confirmLeave };
}
