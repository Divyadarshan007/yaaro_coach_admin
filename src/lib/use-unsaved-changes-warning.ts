"use client";

import { useEffect } from "react";

// Prompts the browser's native "leave site?" dialog on tab close/refresh/typed
// navigation while there are unsaved edits. Doesn't cover in-app link clicks — Next's
// App Router has no built-in navigation-block API, so those are guarded individually
// where a page's own "Back" link is the obvious exit point (see programId/routineId
// editor headers).
export function useUnsavedChangesWarning(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
}
