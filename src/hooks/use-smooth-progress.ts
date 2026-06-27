// hooks/use-smooth-progress.ts（新規）
import { useEffect, useState } from "react";
import { getProgressAt } from "@/lib/timer";
import { useTimerStore } from "@/stores/timer-store";
import type { Timer } from "@/types/timer";

export function useSmoothProgress(timer: Timer): number {
  const runtime = useTimerStore((state) => state.runtimeByTimerId[timer.id]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (timer.status !== "running" || !runtime) {
      return;
    }

    let frameId = 0;

    const loop = () => {
      setNow(Date.now());
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [timer.status, runtime]);

  if (timer.status === "running" && runtime) {
    return getProgressAt(
      timer.initialSeconds,
      runtime.remainingAtStart,
      runtime.startedAt,
      now,
    );
  }

  if (timer.initialSeconds === 0) return 0;
  return timer.remainingSeconds / timer.initialSeconds;
}
