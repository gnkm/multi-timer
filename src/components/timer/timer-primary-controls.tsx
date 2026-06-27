import { Pause, Play, RotateCcw } from "lucide-react";
import { useTimerStore } from "@/stores/timer-store";
import type { Timer } from "@/types/timer";
import { TimerIconButton } from "./timer-icon-button";

type TimerPrimaryControlsProps = {
  timer: Timer;
};

export function TimerPrimaryControls({ timer }: TimerPrimaryControlsProps) {
  const isRunning = timer.status === "running";
  const isStopped = timer.status === "stopped";
  const canStart = isStopped && timer.remainingSeconds > 0;
  const resetTimer = useTimerStore((state) => state.resetTimer);
  const startTimer = useTimerStore((state) => state.startTimer);
  const stopTimer = useTimerStore((state) => state.stopTimer);

  return (
    <div className="flex w-full items-center justify-center gap-2 border-t border-zinc-200/80 pt-4 dark:border-zinc-800/80">
      <TimerIconButton
        disabled={!isRunning && !canStart}
        label={isRunning ? "停止" : "開始"}
      >
        {isRunning ? (
          <Pause
            aria-hidden="true"
            className="size-5"
            onClick={() => stopTimer(timer.id)}
          />
        ) : (
          <Play
            aria-hidden="true"
            className="size-5"
            onClick={() => startTimer(timer.id)}
          />
        )}
      </TimerIconButton>
      <TimerIconButton label="リセット">
        <RotateCcw
          aria-hidden="true"
          className="size-5"
          onClick={() => resetTimer(timer.id)}
        />
      </TimerIconButton>
    </div>
  );
}
