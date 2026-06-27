import { Minimize2 } from "lucide-react";
import { useSmoothProgress } from "@/hooks/use-smooth-progress";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/stores/ui-stores";
import type { Timer } from "@/types/timer";
import { ProgressRing } from "./timer/progress-ring";
import { TimerDisplay } from "./timer/timer-display";
import { TimerIconButton } from "./timer/timer-icon-button";
import { TimerPrimaryControls } from "./timer/timer-primary-controls";

export function MaximizedTimerView({ timer }: { timer: Timer }) {
  const progress = useSmoothProgress(timer);
  const minimizeTimer = useUiStore((state) => state.minimizeTimer);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col",
        "bg-linear-to-b from-zinc-50 to-zinc-100/90",
        "dark:from-zinc-950 dark:to-zinc-900",
      )}
      aria-label="最大化タイマー"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute top-4 right-4">
        <TimerIconButton label="最小化" onClick={minimizeTimer}>
          <Minimize2 aria-hidden="true" className="size-4" />
        </TimerIconButton>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
        <ProgressRing progress={progress} size="large" status={timer.status}>
          <TimerDisplay className="text-5xl sm:text-7xl" timer={timer} />
        </ProgressRing>
        <TimerPrimaryControls timer={timer} />
      </div>
    </div>
  );
}
