import { AppHeader } from "@/components/app-header/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { MaximizedTimerView } from "@/components/maximized-timer-view";
import { TimerCardList } from "@/components/timer/timer-card-list";
import { useTimerTick } from "@/hooks/use-timer-tick";
import { useTimerStore } from "@/stores/timer-store";
import { useUiStore } from "@/stores/ui-stores";

export function App() {
  const timers = useTimerStore((state) => state.timers);
  const maximizedTimerId = useUiStore((state) => state.maximizedTimerId);

  const maximizedTimer = maximizedTimerId
    ? timers.find((timer) => timer.id === maximizedTimerId)
    : undefined;

  useTimerTick();

  return (
    <AppShell>
      {maximizedTimer ? (
        <MaximizedTimerView timer={maximizedTimer} />
      ) : (
        <>
          <AppHeader />
          <TimerCardList timers={timers} />
        </>
      )}
    </AppShell>
  );
}
