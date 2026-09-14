"use client";

import { ImageUp, Plus } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createCustomExerciseAction,
  getCustomExerciseFormOptionsAction,
  uploadCustomExerciseImageAction,
  type CustomExerciseFormOptions,
} from "@/features/routine-editor/actions";
import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

const UNSET = "unset";

// A Tracking Type option rendered as a card (name, "Example: ..." description, and a
// pill per unit it logs, e.g. KG/REPS) — matches the mobile app's "Create exercise" >
// "Tracking type" sheet instead of the plain single-line list every other Select in
// this form uses.
function TrackingTypeOption({
  value,
  name,
  description,
  units,
}: {
  value: string;
  name: string;
  description: string;
  units: string[];
}) {
  return (
    <SelectItem value={value} className="items-start gap-2 rounded-lg px-3 py-2.5">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">{name}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
        {units.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {units.map((unit) => (
              <span
                key={unit}
                className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-foreground"
              >
                {unit}
              </span>
            ))}
          </div>
        )}
      </div>
    </SelectItem>
  );
}

export function CustomExerciseDialog({
  onCreated,
}: {
  onCreated: (exercise: ExerciseCatalogEntry) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [muscleId, setMuscleId] = useState(UNSET);
  const [otherMuscleIds, setOtherMuscleIds] = useState<string[]>([]);
  const [equipmentId, setEquipmentId] = useState(UNSET);
  const [exerciseTypeId, setExerciseTypeId] = useState(UNSET);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formOptions, setFormOptions] = useState<CustomExerciseFormOptions | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  function reset() {
    setName("");
    setMuscleId(UNSET);
    setOtherMuscleIds([]);
    setEquipmentId(UNSET);
    setExerciseTypeId(UNSET);
    setThumbnailUrl(null);
    setPreview(null);
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset();
      return;
    }
    if (formOptions || isLoadingOptions) return;
    setIsLoadingOptions(true);
    getCustomExerciseFormOptionsAction()
      .then(setFormOptions)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load form options"))
      .finally(() => setIsLoadingOptions(false));
  }

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";

    setPreview(URL.createObjectURL(file));
    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const url = await uploadCustomExerciseImageAction(formData);
      setThumbnailUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      setError("Exercise name is required");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const exercise = await createCustomExerciseAction({
        name: name.trim(),
        muscleId: muscleId === UNSET ? null : muscleId,
        otherMusclesId: otherMuscleIds,
        equipmentId: equipmentId === UNSET ? null : equipmentId,
        exerciseTypeId: exerciseTypeId === UNSET ? null : exerciseTypeId,
        thumbnailUrl,
      });
      onCreated(exercise);
      setOpen(false);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create exercise");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="w-full justify-center" />}>
        <Plus className="size-4" />
        Custom Exercise
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custom Exercise</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Thumbnail</label>
            <div className="flex items-center gap-3">
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                {preview || thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview ?? thumbnailUrl ?? ""} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageUp className="size-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : thumbnailUrl ? "Change Image" : "Upload Image"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="custom-exercise-name" className="text-sm font-medium text-foreground">
              Exercise Name
            </label>
            <Input
              id="custom-exercise-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Cable Crossover"
              className="h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Primary Muscle</label>
              <Select
                items={[
                  { value: UNSET, label: "Not set" },
                  ...(formOptions?.muscles.map((o) => ({ value: o.id, label: o.name })) ?? []),
                ]}
                value={muscleId}
                onValueChange={(value) => {
                  setMuscleId(value as string);
                  setOtherMuscleIds((prev) => prev.filter((id) => id !== value));
                }}
                disabled={isLoadingOptions}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={isLoadingOptions ? "Loading..." : undefined} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNSET}>Not set</SelectItem>
                  {formOptions?.muscles.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Equipment</label>
              <Select
                items={[
                  { value: UNSET, label: "Not set" },
                  ...(formOptions?.equipment.map((o) => ({ value: o.id, label: o.name })) ?? []),
                ]}
                value={equipmentId}
                onValueChange={(value) => setEquipmentId(value as string)}
                disabled={isLoadingOptions}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={isLoadingOptions ? "Loading..." : undefined} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNSET}>Not set</SelectItem>
                  {formOptions?.equipment.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Other Muscles</label>
            <Select
              multiple
              items={
                formOptions?.muscles
                  .filter((option) => option.id !== muscleId)
                  .map((o) => ({ value: o.id, label: o.name })) ?? []
              }
              value={otherMuscleIds}
              onValueChange={(value) => setOtherMuscleIds(value as string[])}
              disabled={isLoadingOptions}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={isLoadingOptions ? "Loading..." : "None selected"}>
                  {(value: string[]) =>
                    value.length > 0
                      ? formOptions?.muscles
                          .filter((m) => value.includes(m.id))
                          .map((m) => m.name)
                          .join(", ")
                      : undefined
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {formOptions?.muscles
                  .filter((option) => option.id !== muscleId)
                  .map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Tracking Type</label>
            <Select
              items={[
                { value: UNSET, label: "Weight & Reps (default)" },
                ...(formOptions?.exerciseTypes
                  .filter((o) => o.key !== "weight_reps")
                  .map((o) => ({ value: o.id, label: o.name })) ?? []),
              ]}
              value={exerciseTypeId}
              onValueChange={(value) => setExerciseTypeId(value as string)}
              disabled={isLoadingOptions}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={isLoadingOptions ? "Loading..." : undefined} />
              </SelectTrigger>
              <SelectContent className="w-(--anchor-width) p-1.5">
                <TrackingTypeOption
                  value={UNSET}
                  name="Weight & Reps (default)"
                  description="Example: Bench Press, Dumbbell Curls"
                  units={["KG", "REPS"]}
                />
                {formOptions?.exerciseTypes
                  // Already shown above as the default option — the sentinel "unset"
                  // value maps to the same server-side default (see handleSave).
                  .filter((option) => option.key !== "weight_reps")
                  .map((option) => (
                    <TrackingTypeOption
                      key={option.id}
                      value={option.id}
                      name={option.name}
                      description={option.description}
                      units={option.action}
                    />
                  ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={isSaving || isUploading}>
            {isSaving ? "Saving..." : "Save Exercise"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
