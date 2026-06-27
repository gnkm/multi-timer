import { useState } from "react";
import { useSmoothProgress } from "@/hooks/use-smooth-progress";
import type { Timer } from "@/types/timer";
import { ProgressRing } from "./progress-ring";
import { TimerAddTimeButtons } from "./timer-add-time-buttons";
import { TimerCardActions } from "./timer-card-actions";
import { TimerDisplay } from "./timer-display";
import { TimerEditForm } from "./timer-edit-form";
import { TimerPrimaryControls } from "./timer-primary-controls";

export function TimerCard({
  canDelete,
  timer,
}: {
  canDelete: boolean;
  timer: Timer;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const progress = useSmoothProgress(timer);

  return (
    <article className="relative flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white/90 p-6 pt-12 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/70">
      <TimerCardActions
        canDelete={canDelete}
        isEditing={isEditing}
        onEditClick={() => setIsEditing((current) => !current)}
        timer={timer}
      />

      <div className="flex flex-col items-center gap-3">
        {isEditing ? (
          <TimerEditForm
            onCancel={() => setIsEditing(false)}
            onSaved={() => setIsEditing(false)}
            timer={timer}
          />
        ) : (
          <ProgressRing progress={progress} status={timer.status}>
            <TimerDisplay timer={timer} />
          </ProgressRing>
        )}
        <TimerAddTimeButtons timer={timer} />
      </div>

      <TimerPrimaryControls timer={timer} />
    </article>
  );
}
