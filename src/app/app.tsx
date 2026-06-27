import { AppHeader } from "@/components/app-header/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { TimerCardList } from "@/components/timer/timer-card-list";
import type { Timer } from "@/types/timer";

const timers: Timer[] = [
  {
    id: "1",
    initialSeconds: 60,
    remainingSeconds: 60,
    status: "stopped",
  },
  {
    id: "2",
    initialSeconds: 120,
    remainingSeconds: 120,
    status: "stopped",
  },
  {
    id: "3",
    initialSeconds: 180,
    remainingSeconds: 150,
    status: "stopped",
  },
];

export function App() {
  return (
    <AppShell>
      <AppHeader />
      <TimerCardList timers={timers} />
    </AppShell>
  );
}
