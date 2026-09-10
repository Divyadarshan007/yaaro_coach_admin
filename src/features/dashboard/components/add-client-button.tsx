"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AddClientFormDialog } from "@/features/clients/components/add-client-form-dialog";

type AddClientButtonProps = {
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
};

export function AddClientButton({ variant = "default", size = "lg" }: AddClientButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Add Client
      </Button>
      <AddClientFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
