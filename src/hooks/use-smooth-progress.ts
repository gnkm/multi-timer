// hooks/use-smooth-progress.ts（新規）
import { useEffect, useState } from "react";
import { getProgressAt, getStoppedProgress } from "@/lib/timer";
import { useTimerStore } from "@/stores/timer-store";
import type { Timer } from "@/types/timer";

const PROGRESS_UPDATE_INTERVAL_MS = 200;

export function useSmoothProgress(timer: Timer): number {
  const runtime = useTimerStore((state) => state.runtimeByTimerId[timer.id]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (timer.status !== "running" || !runtime) {
      return;
    }

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, PROGRESS_UPDATE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [timer.status, runtime]);

  if (timer.status === "running" && runtime) {
    return getProgressAt(runtime.remainingAtStart, runtime.startedAt, now);
  }

  return getStoppedProgress(timer.sessionTotalSeconds, timer.remainingSeconds);
}
