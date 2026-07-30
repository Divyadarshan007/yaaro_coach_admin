import type { AvatarInfo } from "@/features/clients/types/client";

const PALETTE = [
  "bg-blue-500 text-white",
  "bg-amber-500 text-white",
  "bg-emerald-500 text-white",
  "bg-red-600 text-white",
  "bg-purple-500 text-white",
  "bg-cyan-600 text-white",
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Deterministic (not random) so the same client/coach always renders the same color
// across requests without needing to persist a color choice anywhere.
export function avatarFromName(name: string, seed: string): AvatarInfo {
  const colorClassName = PALETTE[hashString(seed) % PALETTE.length];
  return { name, initials: initialsFromName(name), colorClassName };
}
