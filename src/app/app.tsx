import { AppHeader } from "@/components/app-header/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { TimerCardList } from "@/components/timer/timer-card-list";
import { useTimerTick } from "@/hooks/use-timer-tick";
import { useTimerStore } from "@/stores/timer-store";

export function App() {
  const timers = useTimerStore((state) => state.timers);
  useTimerTick();

  return (
    <AppShell>
      <AppHeader />
      <TimerCardList timers={timers} />
    </AppShell>
  );
}
