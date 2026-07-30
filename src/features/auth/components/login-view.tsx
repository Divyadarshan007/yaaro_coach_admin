"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/features/auth/components/google-icon";
import { signInWithGoogle, type FirebaseWebConfig } from "@/lib/firebase-client";

export function LoginView({ firebaseConfig }: { firebaseConfig: FirebaseWebConfig }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setError(null);
    setIsLoading(true);

    try {
      const idToken = await signInWithGoogle(firebaseConfig);

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Sign-in failed");
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Google sign-in failed:", err);
      const code = (err as { code?: string })?.code;
      if (code === "auth/invalid-api-key" || code === "auth/api-key-not-valid") {
        setError("Firebase isn't configured correctly — check FIREBASE_WEB_* in yaaro_backend's .env.");
      } else if (code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completing.");
      } else if (code === "auth/unauthorized-domain") {
        setError("This domain isn't authorized for sign-in yet (Firebase Console > Authentication > Settings).");
      } else {
        setError("Something went wrong signing in. Please try again.");
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-2 border-b border-border px-6 py-4">
        <Image src="/yaaro-icon.png" alt="Yaaro Coach" width={36} height={36} priority className="size-9" />
        <span className="text-base font-semibold text-foreground">Yaaro Coach</span>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-semibold text-foreground">Welcome back!</h1>
          <p className="mt-1 text-sm text-muted-foreground">Let&apos;s get you signed in</p>

          <Button
            variant="outline"
            size="lg"
            className="mt-8 w-full justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <GoogleIcon className="size-4" />
            Continue with Google
          </Button>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        </div>
      </main>

      <footer className="flex items-center justify-center gap-4 border-t border-border px-6 py-4 text-xs text-muted-foreground">
        <span>Terms &amp; Conditions</span>
        <span>Privacy Policy</span>
        <span>Contact Us</span>
      </footer>
    </div>
  );
}
