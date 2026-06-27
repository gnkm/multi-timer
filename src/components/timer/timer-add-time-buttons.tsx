import { secondaryButtonClassName } from "@/app/ui";
import { cn } from "@/lib/cn";
import type { Timer } from "@/types/timer";

type TimerAddTimeButtonsProps = {
  timer: Timer;
};

export function TimerAddTimeButtons({ timer }: TimerAddTimeButtonsProps) {
  const isStopped = timer.status === "stopped";

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        className={cn(secondaryButtonClassName, "px-3 py-1.5 text-xs")}
        disabled={!isStopped}
      >
        + 0:10
      </button>
      <button
        type="button"
        className={cn(secondaryButtonClassName, "px-3 py-1.5 text-xs")}
        disabled={!isStopped}
      >
        + 1:00
      </button>
    </div>
  );
}
