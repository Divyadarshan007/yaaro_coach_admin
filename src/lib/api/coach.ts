import { COACH_BACKEND_URL } from "@/lib/api/config";
import { getCoachAuthHeaders } from "@/lib/api/auth-headers";

export type CoachProfile = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  slug: string;
  weight: "kg" | "lbs";
  distance: "kilometers" | "miles";
  bodyMeasurements: "cm" | "in";
  restTimer: "off" | "30" | "60" | "90" | "120" | "180";
  weekStartDay: "sunday" | "monday";
  repetitionOption: "reps" | "rep-range";
};

export type CoachProfileUpdate = Partial<{
  userName: string;
  fullName: string;
  profileImage: string;
  weight: CoachProfile["weight"];
  distance: CoachProfile["distance"];
  bodyMeasurements: CoachProfile["bodyMeasurements"];
  restTimer: CoachProfile["restTimer"];
  weekStartDay: CoachProfile["weekStartDay"];
  repetitionOption: CoachProfile["repetitionOption"];
}>;

// Avatars uploaded via updateCoachProfile come back as backend-relative paths
// (e.g. "/uploads/profile/x-large.jpg"), which the browser can't load directly —
// resolve them against COACH_BACKEND_URL here, server-side, same as clients.ts does
// for feed media. Google-login avatars are already absolute URLs and pass through as-is.
function resolveAvatarUrl(avatar: string): string {
  return avatar && avatar.startsWith("/") ? `${COACH_BACKEND_URL}${avatar}` : avatar;
}

export async function getCoachProfile(): Promise<CoachProfile | null> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/auth/me`, {
    cache: "no-store",
    headers: await getCoachAuthHeaders(),
  });
  if (res.status === 401 || res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch coach profile (${res.status})`);
  const profile: CoachProfile = await res.json();
  return { ...profile, avatar: resolveAvatarUrl(profile.avatar) };
}

export async function updateCoachProfile(patch: CoachProfileUpdate): Promise<CoachProfile> {
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/auth/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await getCoachAuthHeaders()) },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    // Surface Joi/validation messages (e.g. "Username is already taken") instead of a generic error.
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Failed to update coach profile (${res.status})`);
  }
  const profile: CoachProfile = await res.json();
  return { ...profile, avatar: resolveAvatarUrl(profile.avatar) };
}

// Reuses the same temp-upload endpoint as client measurement photos. Returns the raw
// "/uploads/temp/..." path as-is (not resolved to an absolute URL) — updateCoachProfile
// sends it straight back to the backend, which resolves temp paths itself.
export async function uploadCoachAvatarImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("images", file);
  const res = await fetch(`${COACH_BACKEND_URL}/coach/v1/uploads/images`, {
    method: "POST",
    headers: await getCoachAuthHeaders(),
    body: formData,
  });
  if (!res.ok) throw new Error(`Failed to upload image (${res.status})`);
  const { images } = (await res.json()) as { images: { url: string }[] };
  return images[0].url;
}
