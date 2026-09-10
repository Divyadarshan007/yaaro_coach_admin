// Windows Chrome/Edge support navigator.share with files too, which would pop the
// Windows Share flyout (Mail, Nearby Share, "Save to"...) instead of a plain save —
// a confusing surprise for a "Download" button on a PC. Restrict the share-sheet path
// to actual phones/tablets, where it's the only way to reach the gallery at all;
// desktops always get a plain, predictable save into the Downloads folder.
function isMobileDevice(): boolean {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Gets an already-rendered image blob onto the phone's camera roll / gallery. A
// website can't write to the gallery directly (that's native-app-only, e.g. UPI
// apps) — the closest equivalent is the Web Share API: the OS share sheet it opens
// includes a "Save Image"/"Save to Photos" option that lands in the same place.
// Falls back to a plain <a download> on desktop, or on phones without file sharing.
export async function saveBlobAsImage(blob: Blob, fileName: string): Promise<void> {
  const file = new File([blob], fileName, { type: blob.type || "image/png" });

  if (isMobileDevice() && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (err) {
      // User dismissed the share sheet — that's a deliberate cancel, not a failure.
      if (err instanceof Error && err.name === "AbortError") return;
      // Any other share failure (e.g. no matching share target) — fall through to download.
      console.warn("navigator.share failed, falling back to <a download>:", err);
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function slugify(name: string | null | undefined): string {
  return (name ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "studio";
}
