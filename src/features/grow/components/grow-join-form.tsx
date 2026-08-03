"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitLeadAction } from "@/features/grow/actions";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function GrowJoinForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const canSubmit = name.trim() !== "" && EMAIL_PATTERN.test(email.trim()) && acceptedTerms;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    startTransition(async () => {
      try {
        await submitLeadAction(slug, { name: name.trim(), email: email.trim(), message: message.trim(), acceptedTerms });
        setSubmitted(true);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-1 py-6 text-center">
        <p className="text-sm font-medium text-foreground">Thanks for reaching out!</p>
        <p className="text-sm text-muted-foreground">The coach will be in touch with you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="join-name" className="text-sm font-medium text-foreground">
          Full Name
        </label>
        <Input id="join-name" value={name} onChange={(event) => setName(event.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="join-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input id="join-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="join-message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <Textarea id="join-message" rows={4} value={message} onChange={(event) => setMessage(event.target.value)} />
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <Checkbox checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked === true)} />
        I have read and I accept the terms and conditions
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={!canSubmit || isPending}>
        Send
      </Button>
    </form>
  );
}
