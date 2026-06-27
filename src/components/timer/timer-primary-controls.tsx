import { Pause, Play, RotateCcw } from "lucide-react";
import type { Timer } from "@/types/timer";
import { TimerIconButton } from "./timer-icon-button";

type TimerPrimaryControlsProps = {
  timer: Timer;
};

export function TimerPrimaryControls({ timer }: TimerPrimaryControlsProps) {
  const isRunning = timer.status === "running";
  const isStopped = timer.status === "stopped";
  const canStart = isStopped && timer.remainingSeconds > 0;

  return (
    <div className="flex w-full items-center justify-center gap-2 border-t border-zinc-200/80 pt-4 dark:border-zinc-800/80">
      <TimerIconButton
        disabled={!isRunning && !canStart}
        label={isRunning ? "停止" : "開始"}
      >
        {isRunning ? (
          <Pause aria-hidden="true" className="size-5" />
        ) : (
          <Play aria-hidden="true" className="size-5" />
        )}
      </TimerIconButton>
      <TimerIconButton label="リセット">
        <RotateCcw aria-hidden="true" className="size-5" />
      </TimerIconButton>
    </div>
  );
}
