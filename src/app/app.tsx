import { AppHeader } from "@/components/app-header/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { TimerCardList } from "@/components/timer/timer-card-list";
import { useTimerStore } from "@/stores/timer-store";

export function App() {
  const timers = useTimerStore((state) => state.timers);

  return (
    <AppShell>
      <AppHeader />
      <TimerCardList timers={timers} />
    </AppShell>
  );
}
