"use client";

import { ImageUp } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PROGRAM_DURATION_OPTIONS } from "@/features/program-editor/data/program-editor-data";
import { uploadProgramImageAction } from "@/features/program-editor/actions";
import { useMyProgramsStore } from "@/features/program-editor/store/my-programs-store";
import type {
  Program,
  ProgramEquipment,
  ProgramGoal,
  ProgramLevel,
  Visibility,
} from "@/features/program-editor/types/program-editor";

const LEVEL_OPTIONS: { value: ProgramLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const GOAL_OPTIONS: { value: ProgramGoal; label: string }[] = [
  { value: "muscleGain", label: "Muscle Gain" },
  { value: "strength", label: "Strength" },
  { value: "weightLose", label: "Weight Loss" },
];

const EQUIPMENT_OPTIONS: { value: ProgramEquipment; label: string }[] = [
  { value: "gym", label: "Full Gym" },
  { value: "dumbbells", label: "Dumbbells" },
  { value: "none", label: "No Equipment" },
];

const VISIBILITY_OPTIONS: { value: Visibility; label: string }[] = [
  { value: "private", label: "Private (only you)" },
  { value: "public", label: "Public (shared to Explore)" },
];

const UNSET = "unset";

export function ProgramDetailsForm({ program }: { program: Program }) {
  const updateProgramDetails = useMyProgramsStore((state) => state.updateProgramDetails);
  const { title, duration, notes, level, goal, equipment, visibility, image, isFeatured } = program;

  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setTitle = (value: string) => updateProgramDetails(program.id, { title: value });
  const setDuration = (value: string) => updateProgramDetails(program.id, { duration: value });
  const setNotes = (value: string) => updateProgramDetails(program.id, { notes: value });

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";

    setPreview(URL.createObjectURL(file));
    setUploadError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const url = await uploadProgramImageAction(formData);
      updateProgramDetails(program.id, { image: url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Program Image</label>
        <div className="flex items-center gap-3">
          <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
            {preview || image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview ?? image} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImageUp className="size-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : image ? "Change Image" : "Upload Image"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
            {uploadError && <p className="mt-1.5 text-xs text-destructive">{uploadError}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="program-title" className="text-sm font-medium text-foreground">
            Workout Program Title
          </label>
          <Input
            id="program-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-10"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="program-duration" className="text-sm font-medium text-foreground">
            Program Duration
          </label>
          <Select
            items={PROGRAM_DURATION_OPTIONS}
            value={duration}
            onValueChange={(value) => setDuration(value as string)}
          >
            <SelectTrigger id="program-duration" className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROGRAM_DURATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Level</label>
          <Select
            items={[{ value: UNSET, label: "Not set" }, ...LEVEL_OPTIONS]}
            value={level ?? UNSET}
            onValueChange={(value) => updateProgramDetails(program.id, { level: value === UNSET ? null : (value as ProgramLevel) })}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNSET}>Not set</SelectItem>
              {LEVEL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Goal</label>
          <Select
            items={[{ value: UNSET, label: "Not set" }, ...GOAL_OPTIONS]}
            value={goal ?? UNSET}
            onValueChange={(value) => updateProgramDetails(program.id, { goal: value === UNSET ? null : (value as ProgramGoal) })}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNSET}>Not set</SelectItem>
              {GOAL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Equipment</label>
          <Select
            items={[{ value: UNSET, label: "Not set" }, ...EQUIPMENT_OPTIONS]}
            value={equipment ?? UNSET}
            onValueChange={(value) =>
              updateProgramDetails(program.id, { equipment: value === UNSET ? null : (value as ProgramEquipment) })
            }
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNSET}>Not set</SelectItem>
              {EQUIPMENT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Visibility</label>
          <Select
            items={VISIBILITY_OPTIONS}
            value={visibility}
            onValueChange={(value) => updateProgramDetails(program.id, { visibility: value as Visibility })}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
        <span className="flex flex-col">
          <span className="text-sm font-medium text-foreground">Featured</span>
          <span className="text-xs text-muted-foreground">Highlight this program in Explore</span>
        </span>
        <Switch
          checked={isFeatured}
          onCheckedChange={(checked) => updateProgramDetails(program.id, { isFeatured: checked })}
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="program-notes" className="text-sm font-medium text-foreground">
          Program Note
        </label>
        <Textarea
          id="program-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add a brief description of the program"
          className="min-h-24"
        />
      </div>
    </div>
  );
}
