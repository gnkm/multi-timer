// stores/ui-store.ts
import { create } from "zustand";

type UiStore = {
  maximizedTimerId: string | null;
  maximizeTimer: (id: string) => void;
  minimizeTimer: () => void;
};

export const useUiStore = create<UiStore>((set) => ({
  maximizedTimerId: null,
  maximizeTimer: (id) => set({ maximizedTimerId: id }),
  minimizeTimer: () => set({ maximizedTimerId: null }),
}));
