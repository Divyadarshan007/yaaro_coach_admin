"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { ArrowLeft, ArrowRight, Eye, EyeOff, ImagePlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// ≥8 chars, ≥1 lowercase, ≥1 uppercase, ≥1 digit, ≥1 special character.
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const CARD_SHADOW =
  "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]";

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
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<Values>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoTempUrl, setLogoTempUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof Values>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setLogoPreviewUrl(URL.createObjectURL(file));
    setLogoTempUrl(null);
    setLogoError(null);
    setIsUploadingLogo(true);

    const formData = new FormData();
    formData.append("image", file);

    fetch("/api/auth/upload-logo", { method: "POST", body: formData })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Could not upload logo.");
        setLogoTempUrl(data.url as string);
      })
      .catch((err) => {
        setLogoError(err instanceof Error ? err.message : "Could not upload logo.");
      })
      .finally(() => setIsUploadingLogo(false));
  }

  const passwordOk = PASSWORD_PATTERN.test(values.password);
  const passwordsMatch = values.password.length > 0 && values.password === values.confirmPassword;
  const canAdvanceToOwnerDetails = values.studioName.trim().length > 0;
  const canSubmit =
    values.ownerName.trim().length > 0 &&
    EMAIL_PATTERN.test(values.email.trim()) &&
    passwordOk &&
    passwordsMatch &&
    acceptedTerms &&
    !isUploadingLogo &&
    !isLoading;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (step !== 2 || !canSubmit) return;

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
          logo: logoTempUrl || "",
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
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="sticky top-0 hidden h-screen w-1/2 overflow-hidden lg:block">
        <Image
          src="/images/signup-hero-runner.jpg"
          alt="A runner sprinting on a track at golden hour"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/30" />

        <Link href="/" className="absolute top-10 left-10 flex items-center gap-2">
          <Image src="/yaaro-icon.png" alt="Yaaro Studio" width={36} height={36} priority className="size-9" />
          <span className="text-base font-semibold text-white">Yaaro Studio</span>
        </Link>

        <div className="absolute right-10 bottom-10 left-10">
          <h2 className="text-3xl font-semibold leading-tight text-white text-balance">
            Run your coaching studio like a pro.
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Batches, attendance and billing, all in one place.
          </p>
        </div>
      </aside>

      <main className="flex w-full flex-col lg:w-1/2">
        <header className="flex items-center gap-2 border-b border-border px-6 py-4 lg:hidden">
          <Image src="/yaaro-icon.png" alt="Yaaro Studio" width={36} height={36} priority className="size-9" />
          <span className="text-base font-semibold text-foreground">Yaaro Studio</span>
        </header>

        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">
            <div className={`rounded-2xl border border-border bg-card p-6 ${CARD_SHADOW} sm:p-8`}>
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-foreground">
                  {step === 1 ? "Create your studio" : "Set up your login"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step === 1 ? "Tell us about your studio" : "One last step to get started"}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className={`h-1 w-8 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
                <span className={`h-1 w-8 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
              </div>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div className="overflow-hidden">
                  <div
                    className="flex items-start transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
                  >
                    {/* Step 1 — studio details */}
                    <div className="flex w-full shrink-0 flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium text-foreground">
                          Studio logo <span className="font-normal text-muted-foreground">(optional)</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                            {logoPreviewUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={logoPreviewUrl}
                                alt="Studio logo preview"
                                className="size-full object-cover"
                              />
                            ) : (
                              <ImagePlus className="size-5 text-muted-foreground" />
                            )}
                            {isUploadingLogo && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <Loader2 className="size-4 animate-spin text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => logoInputRef.current?.click()}
                              disabled={isUploadingLogo}
                            >
                              {logoPreviewUrl ? "Change logo" : "Upload logo"}
                            </Button>
                            <input
                              ref={logoInputRef}
                              type="file"
                              accept="image/png,image/jpeg,image/svg+xml,image/gif"
                              className="hidden"
                              onChange={handleLogoChange}
                            />
                            {logoError && <p className="mt-1 text-xs text-destructive">{logoError}</p>}
                          </div>
                        </div>
                      </div>

                      <Field label="Studio name" id="studioName">
                        <Input
                          id="studioName"
                          placeholder="Iron Peak Fitness"
                          value={values.studioName}
                          onChange={(event) => set("studioName", event.target.value)}
                        />
                      </Field>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Phone" id="phone" hint="Optional">
                          <Input
                            id="phone"
                            type="tel"
                            autoComplete="tel"
                            placeholder="+91 98765 43210"
                            value={values.phone}
                            onChange={(event) => set("phone", event.target.value)}
                          />
                        </Field>

                        <Field label="Address" id="address" hint="Optional">
                          <Input
                            id="address"
                            placeholder="City, State"
                            value={values.address}
                            onChange={(event) => set("address", event.target.value)}
                          />
                        </Field>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Step 1 of 2</span>
                        <Button
                          type="button"
                          size="icon-lg"
                          className="rounded-full"
                          onClick={() => canAdvanceToOwnerDetails && setStep(2)}
                          disabled={!canAdvanceToOwnerDetails}
                          aria-label="Continue to owner details"
                        >
                          <ArrowRight />
                        </Button>
                      </div>
                    </div>

                    {/* Step 2 — owner details */}
                    <div className="flex w-full shrink-0 flex-col gap-4 pl-px">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="-ml-1 flex items-center gap-1 self-start text-sm text-muted-foreground hover:text-foreground"
                      >
                        <ArrowLeft className="size-4" />
                        Back
                      </button>

                      <Field label="Your name" id="ownerName">
                        <Input
                          id="ownerName"
                          autoComplete="name"
                          placeholder="Jane Doe"
                          value={values.ownerName}
                          onChange={(event) => set("ownerName", event.target.value)}
                        />
                      </Field>

                      <Field label="Email" id="email">
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@studio.com"
                          value={values.email}
                          onChange={(event) => set("email", event.target.value)}
                        />
                      </Field>

                      <Field label="Password" id="password">
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className="pr-10"
                            value={values.password}
                            onChange={(event) => set("password", event.target.value)}
                            aria-invalid={values.password.length > 0 && !passwordOk}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            aria-pressed={showPassword}
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          At least 8 characters, with an uppercase letter, a lowercase letter, a number,
                          and a special character.
                        </p>
                      </Field>

                      <Field label="Confirm password" id="confirmPassword">
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className="pr-10"
                            value={values.confirmPassword}
                            onChange={(event) => set("confirmPassword", event.target.value)}
                            aria-invalid={values.confirmPassword.length > 0 && !passwordsMatch}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            aria-pressed={showConfirmPassword}
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                        {values.confirmPassword.length > 0 && !passwordsMatch && (
                          <p className="text-xs text-destructive">Passwords do not match</p>
                        )}
                      </Field>

                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Checkbox
                          checked={acceptedTerms}
                          onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                        />
                        I agree to the Terms &amp; Conditions and Privacy Policy
                      </label>
                    </div>
                  </div>
                </div>

                {error && step === 2 && <p className="text-sm text-destructive">{error}</p>}

                {step === 2 && (
                  <Button type="submit" size="lg" className="mt-2 w-full justify-center" disabled={!canSubmit}>
                    {isLoading ? "Creating…" : "Create studio"}
                  </Button>
                )}
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  id,
  hint,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
