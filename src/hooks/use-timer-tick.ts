import { useEffect } from "react";
import { useTimerStore } from "@/stores/timer-store";

export function useTimerTick() {
  useEffect(() => {
    const interval = setInterval(() => {
      useTimerStore.getState().tick();
    }, 250);

    return () => clearInterval(interval);
  }, []);
}
