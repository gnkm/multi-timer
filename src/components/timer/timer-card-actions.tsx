import { Maximize2, Pencil, Trash2 } from "lucide-react";
import { useTimerStore } from "@/stores/timer-store";
import type { Timer } from "@/types/timer";
import { TimerIconButton } from "./timer-icon-button";

type TimerCardActionsProps = {
  canDelete: boolean;
  isEditing: boolean;
  onEditClick: () => void;
  timer: Timer;
};

export function TimerCardActions({
  canDelete,
  isEditing,
  onEditClick,
  timer,
}: TimerCardActionsProps) {
  const isStopped = timer.status === "stopped";
  const removeTimer = useTimerStore((state) => state.removeTimer);

  return (
    <div className="absolute top-4 right-4 flex items-center gap-1">
      <TimerIconButton
        disabled={!isStopped}
        label={isEditing ? "編集を閉じる" : "編集"}
        onClick={onEditClick}
      >
        <Pencil aria-hidden="true" className="size-4" />
      </TimerIconButton>
      <TimerIconButton label="最大化">
        <Maximize2 aria-hidden="true" className="size-4" />
      </TimerIconButton>
      <TimerIconButton disabled={!canDelete} label="削除">
        <Trash2
          aria-hidden="true"
          className="size-4"
          onClick={() => removeTimer(timer.id)}
        />
      </TimerIconButton>
    </div>
  );
}
