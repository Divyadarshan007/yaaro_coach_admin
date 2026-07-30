import { COACH_BACKEND_URL } from "@/lib/api/config";
import type { FirebaseWebConfig } from "@/lib/firebase-client";

export async function getFirebaseWebConfig(): Promise<FirebaseWebConfig> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/auth/firebase-config`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch Firebase web config (${res.status})`);
  return res.json();
}
