import type { Timer } from "@/types/timer";

export const DEFAULT_INITIAL_SECONDS = 60;
export const MAX_TIMER_SECONDS = 99 * 3600 + 59 * 60 + 59;

export function createTimer(seconds: number = DEFAULT_INITIAL_SECONDS): Timer {
  return {
    id: crypto.randomUUID(),
    initialSeconds: seconds,
    remainingSeconds: seconds,
    status: "stopped",
  };
}

export function getRemainingSecondsAt(
  remainingAtStart: number,
  startedAt: number,
  now = Date.now(),
): number {
  const elapsed = Math.floor((now - startedAt) / 1000);
  return Math.max(0, remainingAtStart - elapsed);
}
