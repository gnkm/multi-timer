import { Maximize2, Pencil, Trash2 } from "lucide-react";
import type { Timer } from "@/types/timer";
import { TimerIconButton } from "./timer-icon-button";

type TimerCardActionsProps = {
  canDelete: boolean;
  timer: Timer;
};

export function TimerCardActions({ canDelete, timer }: TimerCardActionsProps) {
  const isStopped = timer.status === "stopped";

  return (
    <div className="absolute top-4 right-4 flex items-center gap-1">
      <TimerIconButton disabled={!isStopped} label="編集">
        <Pencil aria-hidden="true" className="size-4" />
      </TimerIconButton>
      <TimerIconButton label="最大化">
        <Maximize2 aria-hidden="true" className="size-4" />
      </TimerIconButton>
      <TimerIconButton disabled={!canDelete} label="削除">
        <Trash2 aria-hidden="true" className="size-4" />
      </TimerIconButton>
    </div>
  );
}
