import { create } from "zustand";

type SubscriptionGateState = {
  isOpen: boolean;
  message: string;
  open: (message: string) => void;
  close: () => void;
};

// Populated by handleMutationError whenever a mutation is blocked because the studio has
// no active subscription, and read by <SubscriptionRequiredDialog /> (mounted once in
// (main)/layout.tsx) — same shape as useExerciseCatalogStore, this repo's existing pattern
// for global client state any component can reach without prop drilling.
export const useSubscriptionGateStore = create<SubscriptionGateState>((set) => ({
  isOpen: false,
  message: "",
  open: (message) => set({ isOpen: true, message }),
  close: () => set({ isOpen: false }),
}));
