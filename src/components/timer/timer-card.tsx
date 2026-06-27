import type { Timer } from "@/types/timer";
import { ProgressRing } from "./progress-ring";
import { TimerControls } from "./timer-controls";
import { TimerDisplay } from "./timer-display";

export function TimerCard({ timer }: { timer: Timer }) {
  const progress =
    timer.initialSeconds === 0
      ? 0
      : timer.remainingSeconds / timer.initialSeconds;
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/70">
      <ProgressRing progress={progress} status={timer.status}>
        <TimerDisplay timer={timer} />
      </ProgressRing>
      <TimerControls />
    </div>
  );
}
