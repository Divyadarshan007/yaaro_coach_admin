"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  filterExerciseCatalog,
  getDistinctEquipment,
  getDistinctExerciseMuscles,
} from "@/features/routine-editor/lib/exercise-filters";
import type { ExerciseCatalogEntry } from "@/lib/api/exercises";

const ALL_VALUE = "all";

export function ExercisePickerPanel({
  catalog,
  onAddExercise,
}: {
  catalog: ExerciseCatalogEntry[];
  onAddExercise: (exercise: ExerciseCatalogEntry) => void;
}) {
  const [search, setSearch] = useState("");
  const [equipmentId, setEquipmentId] = useState<string | null>(null);
  const [muscleId, setMuscleId] = useState<string | null>(null);

  const equipmentOptions = useMemo(() => getDistinctEquipment(catalog), [catalog]);
  const muscleOptions = useMemo(() => getDistinctExerciseMuscles(catalog), [catalog]);
  const filtered = useMemo(
    () => filterExerciseCatalog(catalog, { search, equipmentId, muscleId }),
    [catalog, search, equipmentId, muscleId]
  );

  return (
    <div className="flex min-h-0 flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 lg:h-full">
      <Button variant="link" size="sm" className="h-auto w-fit gap-1 p-0" disabled title="Coming soon">
        <Plus className="size-4" />
        Custom Exercise
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Select
          items={[{ value: ALL_VALUE, label: "Equipment" }, ...equipmentOptions.map((o) => ({ value: o.id, label: o.label }))]}
          value={equipmentId ?? ALL_VALUE}
          onValueChange={(value) => setEquipmentId(value === ALL_VALUE ? null : (value as string))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Equipment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Equipment</SelectItem>
            {equipmentOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={[{ value: ALL_VALUE, label: "Muscles" }, ...muscleOptions.map((o) => ({ value: o.id, label: o.label }))]}
          value={muscleId ?? ALL_VALUE}
          onValueChange={(value) => setMuscleId(value === ALL_VALUE ? null : (value as string))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Muscles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Muscles</SelectItem>
            {muscleOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search exercises"
          className="h-9 pl-9"
        />
      </div>

      <p className="text-xs font-medium text-muted-foreground">All Exercises</p>

      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">No exercises found.</p>
        )}
        {filtered.map((exercise) => (
          <div key={exercise._id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50">
            <Button
              size="icon-sm"
              className="shrink-0 rounded-full"
              aria-label={`Add ${exercise.name}`}
              onClick={() => onAddExercise(exercise)}
            >
              <Plus />
            </Button>
            {exercise.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={exercise.thumbnailUrl}
                alt=""
                className="size-9 shrink-0 rounded-full bg-muted object-cover"
              />
            ) : (
              <div className="size-9 shrink-0 rounded-full bg-muted" />
            )}
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-foreground">{exercise.name}</span>
              <span className="truncate text-xs text-muted-foreground">{exercise.muscleId?.name ?? "—"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
