import type { Timer } from "@/types/timer";

export function TimerDisplay({ timer }: { timer: Timer }) {
  return (
    <div>
      <div className="text-2xl font-bold">{timer.remainingSeconds}</div>
    </div>
  );
}
