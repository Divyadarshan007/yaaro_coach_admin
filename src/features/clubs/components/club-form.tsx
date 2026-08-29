"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uploadClubImageAction } from "@/features/clubs/actions";
import { cn } from "@/lib/utils";
import {
  CLUB_PURPOSE_TAGS,
  CLUB_PURPOSE_TAG_LABELS,
  CLUB_SPORT_TYPES,
  CLUB_SPORT_TYPE_LABELS,
} from "@/features/clubs/types/club";
import type {
  Club,
  ClubFormValues,
  ClubPurposeTag,
  ClubSportType,
  CreateClubInput,
} from "@/features/clubs/types/club";

const MAX_PURPOSE_TAGS = 3;

export function emptyClubForm(): ClubFormValues {
  return {
    title: "",
    description: "",
    sportType: "all",
    visibility: "public",
    locationType: "global",
    location: { city: "", state: "", country: "" },
    purposeTags: [],
    imageUrl: "",
    coverImageUrl: "",
  };
}

export function clubToForm(club: Club): ClubFormValues {
  const sportType = (CLUB_SPORT_TYPES as readonly string[]).includes(club.sportType)
    ? (club.sportType as ClubSportType)
    : "all";
  return {
    title: club.title,
    description: club.description ?? "",
    sportType,
    visibility: club.visibility,
    locationType: club.locationType,
    location: {
      city: club.location.city ?? "",
      state: club.location.state ?? "",
      country: club.location.country ?? "",
    },
    purposeTags: club.purposeTags.filter((tag): tag is ClubPurposeTag =>
      (CLUB_PURPOSE_TAGS as readonly string[]).includes(tag)
    ),
    // Already resolved to absolute URLs by the api layer — fine to send back as-is
    // (the backend only moves temp paths, leaves everything else untouched).
    imageUrl: club.imageUrl,
    coverImageUrl: club.coverImageUrl,
  };
}

export function formToInput(values: ClubFormValues): CreateClubInput {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    sportType: values.sportType,
    purposeTags: values.purposeTags,
    imageUrl: values.imageUrl,
    coverImageUrl: values.coverImageUrl,
    visibility: values.visibility,
    locationType: values.locationType,
    location:
      values.locationType === "city"
        ? {
            city: values.location.city.trim(),
            state: values.location.state.trim(),
            country: values.location.country.trim(),
          }
        : { city: "", state: "", country: "" },
  };
}

export function isClubFormValid(values: ClubFormValues): boolean {
  if (values.title.trim().length === 0) return false;
  if (values.locationType === "city" && values.location.city.trim().length === 0) return false;
  return true;
}

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  aspect: "square" | "wide";
};

function ImageField({ label, value, onChange, disabled, aspect }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shown = preview || value;

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const url = await uploadClubImageAction(formData);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview("");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-input bg-muted/40",
            aspect === "square" ? "size-20" : "h-20 w-32"
          )}
        >
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-5 text-muted-foreground" />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
            >
              {shown ? "Replace" : "Upload"}
            </Button>
            {shown && !uploading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={() => {
                  setPreview("");
                  onChange("");
                }}
              >
                <X />
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">PNG or JPG.</p>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

type ClubFormProps = {
  values: ClubFormValues;
  onChange: (patch: Partial<ClubFormValues>) => void;
  disabled?: boolean;
};

export function ClubForm({ values, onChange, disabled }: ClubFormProps) {
  function togglePurposeTag(tag: ClubPurposeTag, checked: boolean) {
    if (checked) {
      if (values.purposeTags.length >= MAX_PURPOSE_TAGS) return;
      onChange({ purposeTags: [...values.purposeTags, tag] });
    } else {
      onChange({ purposeTags: values.purposeTags.filter((t) => t !== tag) });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <ImageField
          label="Club image"
          value={values.imageUrl}
          onChange={(url) => onChange({ imageUrl: url })}
          disabled={disabled}
          aspect="square"
        />
        <ImageField
          label="Cover image"
          value={values.coverImageUrl}
          onChange={(url) => onChange({ coverImageUrl: url })}
          disabled={disabled}
          aspect="wide"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="club-title" className="text-sm font-medium text-foreground">
          Name
        </label>
        <Input
          id="club-title"
          value={values.title}
          disabled={disabled}
          onChange={(event) => onChange({ title: event.target.value })}
          placeholder="Morning Runners Club"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="club-description" className="text-sm font-medium text-foreground">
          Description
        </label>
        <Textarea
          id="club-description"
          value={values.description}
          disabled={disabled}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="What is this club about?"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Activity</span>
          <Select<string>
            value={values.sportType}
            disabled={disabled}
            onValueChange={(value) => value && onChange({ sportType: value as ClubSportType })}
          >
            <SelectTrigger>
              <SelectValue>
                {(value: string) => CLUB_SPORT_TYPE_LABELS[value as ClubSportType] ?? value}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CLUB_SPORT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {CLUB_SPORT_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Visibility</span>
          <Select<string>
            value={values.visibility}
            disabled={disabled}
            onValueChange={(value) =>
              value && onChange({ visibility: value as ClubFormValues["visibility"] })
            }
          >
            <SelectTrigger>
              <SelectValue>
                {(value: string) => (value === "private" ? "Private" : "Public")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public — anyone can find and join</SelectItem>
              <SelectItem value="private">Private — members join by request</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Location</span>
        <Select<string>
          value={values.locationType}
          disabled={disabled}
          onValueChange={(value) =>
            value && onChange({ locationType: value as ClubFormValues["locationType"] })
          }
        >
          <SelectTrigger>
            <SelectValue>
              {(value: string) => (value === "city" ? "City-based" : "Global")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Global — open to everyone, anywhere</SelectItem>
            <SelectItem value="city">City-based — tied to a location</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {values.locationType === "city" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="club-city" className="text-sm font-medium text-foreground">
              City
            </label>
            <Input
              id="club-city"
              value={values.location.city}
              disabled={disabled}
              onChange={(event) =>
                onChange({ location: { ...values.location, city: event.target.value } })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="club-state" className="text-sm font-medium text-foreground">
              State
            </label>
            <Input
              id="club-state"
              value={values.location.state}
              disabled={disabled}
              onChange={(event) =>
                onChange({ location: { ...values.location, state: event.target.value } })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="club-country" className="text-sm font-medium text-foreground">
              Country
            </label>
            <Input
              id="club-country"
              value={values.location.country}
              disabled={disabled}
              onChange={(event) =>
                onChange({ location: { ...values.location, country: event.target.value } })
              }
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">
          Purpose <span className="font-normal text-muted-foreground">(up to {MAX_PURPOSE_TAGS})</span>
        </span>
        <div className="grid gap-2 sm:grid-cols-2">
          {CLUB_PURPOSE_TAGS.map((tag) => {
            const checked = values.purposeTags.includes(tag);
            const atLimit = !checked && values.purposeTags.length >= MAX_PURPOSE_TAGS;
            return (
              <label
                key={tag}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm",
                  atLimit || disabled ? "opacity-50" : "cursor-pointer"
                )}
              >
                <Checkbox
                  checked={checked}
                  disabled={disabled || atLimit}
                  onCheckedChange={(value) => togglePurposeTag(tag, value === true)}
                />
                {CLUB_PURPOSE_TAG_LABELS[tag]}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
