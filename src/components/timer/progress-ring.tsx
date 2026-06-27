import type { ReactNode } from "react";
import type { TimerStatus } from "@/types/timer";

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type ProgressRingProps = {
  children: ReactNode;
  progress: number;
  status: TimerStatus;
};

function getProgressStrokeClass(status: TimerStatus): string {
  switch (status) {
    case "completed":
      return "stroke-emerald-500";
    case "running":
      return "stroke-blue-500";
    default:
      return "stroke-zinc-900 dark:stroke-zinc-100";
  }
}

export function ProgressRing({
  children,
  progress,
  status,
}: ProgressRingProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const offset = CIRCUMFERENCE * (1 - clampedProgress);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="size-48" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          className="stroke-zinc-200 dark:stroke-zinc-700"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          className={getProgressStrokeClass(status)}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
