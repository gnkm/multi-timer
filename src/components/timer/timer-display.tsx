import { cn } from "@/lib/cn";
import { formatRemainingSeconds } from "@/lib/timer";
import type { Timer } from "@/types/timer";

export function TimerDisplay({
  className,
  timer,
}: {
  className?: string;
  timer: Timer;
}) {
  return (
    <div>
      <div className={cn("text-2xl font-bold tabular-nums", className)}>
        {formatRemainingSeconds(timer.remainingSeconds)}
      </div>
    </div>
  );
}
