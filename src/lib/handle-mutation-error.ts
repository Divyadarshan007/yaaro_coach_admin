"use client";

import { useSubscriptionGateStore } from "@/lib/subscription-gate-store";
import { SUBSCRIPTION_REQUIRED_PREFIX } from "@/lib/subscription-required";

// Drop-in replacement for `setError(err instanceof Error ? err.message : "...")` in a
// mutation's catch block — routes a subscription-blocked failure to the global popup
// instead of the dialog's own inline error text, and falls back to the normal inline
// message for every other error.
export function handleMutationError(err: unknown, setLocalError: (message: string) => void) {
  if (err instanceof Error && err.message.startsWith(SUBSCRIPTION_REQUIRED_PREFIX)) {
    useSubscriptionGateStore.getState().open(err.message.slice(SUBSCRIPTION_REQUIRED_PREFIX.length));
    return;
  }
  setLocalError(err instanceof Error ? err.message : "Something went wrong");
}
