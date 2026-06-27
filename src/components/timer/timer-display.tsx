import { formatRemainingSeconds } from "@/lib/timer";
import type { Timer } from "@/types/timer";

export function TimerDisplay({ timer }: { timer: Timer }) {
  return (
    <div>
      <div className="text-2xl font-bold">
        {formatRemainingSeconds(timer.remainingSeconds)}
      </div>
    </div>
  );
}
