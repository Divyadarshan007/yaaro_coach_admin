"use client";

import { ImagePlus, X } from "lucide-react";
import { type ChangeEvent, type ReactNode, useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { logClientMeasurementAction } from "@/features/clients/actions";
import { MEASUREMENT_FIELDS, MEASUREMENT_UNIT_BY_KEY } from "@/features/clients/lib/measurement-fields";

const EMPTY_VALUES: Record<string, string> = Object.fromEntries(MEASUREMENT_FIELDS.map((field) => [field.key, ""]));

export function LogMeasurementDialog({ clientId, children }: { clientId: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(() => new Date());
  const [values, setValues] = useState<Record<string, string>>(EMPTY_VALUES);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  function reset() {
    setDate(new Date());
    setValues(EMPTY_VALUES);
    setImageFile(null);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImageFile(null);
    setImagePreviewUrl(null);
  }

  const hasAnyValue = imageFile !== null || Object.values(values).some((value) => value.trim() !== "");

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("date", date.toISOString().slice(0, 10));
        for (const field of MEASUREMENT_FIELDS) {
          formData.set(field.key, values[field.key]);
        }
        if (imageFile) formData.set("image", imageFile);

        await logClientMeasurementAction(clientId, formData);
        handleOpenChange(false);
      } catch {
        setError("Failed to save measurement. Please try again.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size="sm" />}>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Client Measurement</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-foreground">Date</span>
            <DatePicker value={date} onChange={setDate} className="w-44" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Progress Picture</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {imagePreviewUrl ? (
              <div className="relative size-32 overflow-hidden rounded-lg border border-dashed border-input">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview, next/image doesn't support blob URLs */}
                <img src={imagePreviewUrl} alt="Progress picture preview" className="size-full object-cover" />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  className="absolute top-1 right-1"
                  onClick={handleRemoveImage}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 items-center justify-center gap-1.5 rounded-lg border border-dashed border-input text-sm font-medium text-primary outline-none transition-colors hover:bg-muted"
              >
                <ImagePlus className="size-4" />
                Upload Image
              </button>
            )}
          </div>

          <div className="rounded-lg border border-border">
            {MEASUREMENT_FIELDS.map((field, index) => (
              <div
                key={field.key}
                className={
                  index < MEASUREMENT_FIELDS.length - 1
                    ? "flex items-center justify-between gap-4 border-b border-border px-3 py-2.5"
                    : "flex items-center justify-between gap-4 px-3 py-2.5"
                }
              >
                <span className="text-sm text-foreground">
                  {field.label} ({MEASUREMENT_UNIT_BY_KEY[field.key]})
                </span>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="-"
                  className="h-8 w-24 text-right"
                  value={values[field.key]}
                  onChange={(event) => setValues((prev) => ({ ...prev, [field.key]: event.target.value }))}
                />
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogBody>

        <DialogFooter className="flex-row justify-end">
          <Button variant="outline" size="lg" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button size="lg" disabled={!hasAnyValue || isPending} onClick={handleSave}>
            {isPending ? "Saving..." : "Save Measurement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
