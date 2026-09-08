"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// ≥8 chars, ≥1 lowercase, ≥1 uppercase, ≥1 digit, ≥1 special character.
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

type Values = {
  ownerName: string;
  studioName: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const EMPTY: Values = {
  ownerName: "",
  studioName: "",
  phone: "",
  address: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function SignupView() {
  const router = useRouter();
  const [values, setValues] = useState<Values>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Values>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  const passwordOk = PASSWORD_PATTERN.test(values.password);
  const passwordsMatch = values.password.length > 0 && values.password === values.confirmPassword;
  const canSubmit =
    values.ownerName.trim().length > 0 &&
    values.studioName.trim().length > 0 &&
    values.phone.trim().length > 0 &&
    EMAIL_PATTERN.test(values.email.trim()) &&
    passwordOk &&
    passwordsMatch &&
    !isLoading;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName: values.ownerName.trim(),
          studioName: values.studioName.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Could not create your account.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-2 border-b border-border px-6 py-4">
        <Image src="/yaaro-icon.png" alt="Yaaro Coach" width={36} height={36} priority className="size-9" />
        <span className="text-base font-semibold text-foreground">Yaaro Coach</span>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground">Create your studio</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Set up your coaching studio in a minute
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <Field label="Your name">
              <Input
                autoComplete="name"
                value={values.ownerName}
                onChange={(event) => set("ownerName", event.target.value)}
              />
            </Field>

            <Field label="Studio name">
              <Input
                value={values.studioName}
                onChange={(event) => set("studioName", event.target.value)}
              />
            </Field>

            <Field label="Phone">
              <Input
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(event) => set("phone", event.target.value)}
              />
            </Field>

            <Field label="Address" hint="Optional">
              <Input
                value={values.address}
                onChange={(event) => set("address", event.target.value)}
              />
            </Field>

            <Field label="Email">
              <Input
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => set("email", event.target.value)}
              />
            </Field>

            <Field label="Password">
              <Input
                type="password"
                autoComplete="new-password"
                value={values.password}
                onChange={(event) => set("password", event.target.value)}
                aria-invalid={values.password.length > 0 && !passwordOk}
              />
              <p className="text-xs text-muted-foreground">
                At least 8 characters, with an uppercase letter, a lowercase letter, a number,
                and a special character.
              </p>
            </Field>

            <Field label="Confirm password">
              <Input
                type="password"
                autoComplete="new-password"
                value={values.confirmPassword}
                onChange={(event) => set("confirmPassword", event.target.value)}
                aria-invalid={values.confirmPassword.length > 0 && !passwordsMatch}
              />
              {values.confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </Field>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" size="lg" className="mt-2 w-full justify-center" disabled={!canSubmit}>
              {isLoading ? "Creating…" : "Create studio"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
