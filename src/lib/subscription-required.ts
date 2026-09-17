// A sentinel prefix on a thrown Error's message, not the message shown to the user.
// Server Actions only preserve a thrown Error's `.message` string across the client/server
// boundary (a custom Error subclass loses its identity), so this is how
// src/lib/api/errors.ts signals "studio has no active subscription" and
// src/lib/handle-mutation-error.ts detects it to open the global popup instead of
// rendering the message inline.
export const SUBSCRIPTION_REQUIRED_PREFIX = "__SUBSCRIPTION_REQUIRED__::";
