import type { Timer } from "@/types/timer";
import { TimerCard } from "./timer-card";

export function TimerCardList({ timers }: { timers: Timer[] }) {
  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {timers.map((timer) => (
        <TimerCard key={timer.id} canDelete={timers.length > 1} timer={timer} />
      ))}
    </div>
  );
}
