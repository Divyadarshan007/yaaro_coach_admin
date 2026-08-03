"use client";

import { Check, ExternalLink, Link2, SquarePen } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GrowContactFormPreview } from "@/features/grow/components/grow-contact-form-preview";
import { PUBLIC_APP_URL } from "@/lib/api/config";

export function GrowContactFormCard({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const link = `${PUBLIC_APP_URL}/${slug}/join`;

  async function handleCopyLink() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">Contact Form</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="lg">
            <SquarePen />
            Customize
          </Button>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            disabled={!slug}
            render={<a href={link} target="_blank" rel="noreferrer" />}
          >
            <ExternalLink />
            Preview
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-1 flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Get leads by pasting the link on your webpage or social media bio. Your potential
              clients will be directed to a customized contact form with your graphics and personal
              touch. Responses from users filling out the form will be conveniently displayed in the
              &apos;Leads&apos; section below.{" "}
              <span className="cursor-pointer text-primary hover:underline">Learn More</span>.
            </p>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">Link</span>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input readOnly value={link} className="h-9 flex-1" />
                <Button size="lg" onClick={handleCopyLink} disabled={!slug}>
                  {copied ? <Check /> : <Link2 />}
                  {copied ? "Copied" : "Copy Link"}
                </Button>
              </div>
            </div>
          </div>

          <GrowContactFormPreview />
        </CardContent>
      </Card>
    </div>
  );
}
