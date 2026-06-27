import { Plus } from "lucide-react";
import { buttonClassName } from "@/app/ui";
import { cn } from "@/lib/cn";
import { useTimerStore } from "@/stores/timer-store";

export function AddTimerButton() {
  const addTimer = useTimerStore((state) => state.addTimer);

  return (
    <button
      type="button"
      className={cn(buttonClassName, "size-14 shrink-0 rounded-full p-0")}
      aria-label="タイマーを追加"
      onClick={addTimer}
    >
      <Plus aria-hidden="true" className="size-10" />
    </button>
  );
}
