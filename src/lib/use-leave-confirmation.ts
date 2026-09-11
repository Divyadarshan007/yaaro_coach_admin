"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Gates a "Back" link behind the UnsavedChangesDialog while there are unsaved edits —
// pass the click event + destination to `requestLeave`; if not dirty it's a no-op and
// the link navigates normally, otherwise it opens the confirm dialog and holds the
// destination until the user confirms.
export function useLeaveConfirmation(isDirty: boolean) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  function requestLeave(event: React.MouseEvent, href: string) {
    if (!isDirty) return;
    event.preventDefault();
    setPendingHref(href);
  }

  function cancel() {
    setPendingHref(null);
  }

  function confirmLeave() {
    if (pendingHref) router.push(pendingHref);
    setPendingHref(null);
  }

  return { isConfirmOpen: pendingHref !== null, requestLeave, cancel, confirmLeave };
}
