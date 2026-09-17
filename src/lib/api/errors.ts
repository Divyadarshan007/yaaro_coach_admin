import { SUBSCRIPTION_REQUIRED_PREFIX } from "@/lib/subscription-required";

// Shared error parsing for every lib/api/*.ts mutating call — a Joi validation failure
// (see middlewares/validator.js) sends the generic `message: "Validation failed"` plus the
// actual per-field reason(s) in `errors` (e.g. `{ password: ["Password must be at least 8
// characters..."] }`); prefer that specific text. A blocked-by-subscription response
// (`code: "SUBSCRIPTION_REQUIRED"`, see studioSubscriptionGuard.js) is re-thrown with a
// sentinel prefix instead, so the caller's catch block can route it to the global
// "Subscription required" popup via handleMutationError rather than showing it inline.
export async function parseApiError(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => null);

  if (body?.code === "SUBSCRIPTION_REQUIRED") {
    throw new Error(SUBSCRIPTION_REQUIRED_PREFIX + (body.message || fallback));
  }

  const fieldMessages = body?.errors
    ? Object.values(body.errors as Record<string, string[]>).flat()
    : [];
  throw new Error(fieldMessages.join(" ") || body?.message || `${fallback} (${res.status})`);
}
