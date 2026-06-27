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

export function formatRemainingSeconds(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }

  return `${minutes}:${ss}`;
}
