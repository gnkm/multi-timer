import { create } from "zustand";
import {
  createTimer,
  getRemainingSecondsAt,
  MAX_TIMER_SECONDS,
} from "@/lib/timer";
import type { Timer } from "@/types/timer";

type TimerRuntime = {
  remainingAtStart: number;
  startedAt: number;
};

type TimerStoreState = {
  runtimeByTimerId: Record<string, TimerRuntime>;
  timers: Timer[];
};

type TimerStoreActions = {
  addSeconds: (id: string, seconds: number) => boolean;
  addTimer: () => void;
  editTimer: (id: string, seconds: number) => void;
  removeTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  startTimer: (id: string) => void;
  stopTimer: (id: string) => void;
  tick: () => void;
  toggleStartStop: (id: string) => void;
};

export type TimerStore = TimerStoreState & TimerStoreActions;

const initialState: TimerStoreState = {
  runtimeByTimerId: {},
  timers: [createTimer()],
};

function clearRuntime(
  runtimeByTimerId: Record<string, TimerRuntime>,
  id: string,
): Record<string, TimerRuntime> {
  const { [id]: _removed, ...rest } = runtimeByTimerId;
  return rest;
}

function updateTimer(
  timers: Timer[],
  id: string,
  updater: (timer: Timer) => Timer,
): Timer[] {
  return timers.map((timer) => (timer.id === id ? updater(timer) : timer));
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  ...initialState,

  addTimer: () => {
    set((state) => ({
      timers: [...state.timers, createTimer()],
    }));
  },

  removeTimer: (id) => {
    set((state) => {
      if (state.timers.length <= 1) {
        return state;
      }

      return {
        runtimeByTimerId: clearRuntime(state.runtimeByTimerId, id),
        timers: state.timers.filter((timer) => timer.id !== id),
      };
    });
  },

  startTimer: (id) => {
    set((state) => {
      const timer = state.timers.find((item) => item.id === id);
      if (
        !timer ||
        timer.status === "running" ||
        timer.status === "completed" ||
        timer.remainingSeconds === 0
      ) {
        return state;
      }

      return {
        runtimeByTimerId: {
          ...state.runtimeByTimerId,
          [id]: {
            remainingAtStart: timer.remainingSeconds,
            startedAt: Date.now(),
          },
        },
        timers: updateTimer(state.timers, id, (current) => ({
          ...current,
          sessionTotalSeconds: timer.remainingSeconds,
          status: "running",
        })),
      };
    });
  },

  stopTimer: (id) => {
    set((state) => {
      const runtime = state.runtimeByTimerId[id];
      const timer = state.timers.find((item) => item.id === id);
      if (!runtime || !timer || timer.status !== "running") {
        return state;
      }

      return {
        runtimeByTimerId: clearRuntime(state.runtimeByTimerId, id),
        timers: updateTimer(state.timers, id, (current) => ({
          ...current,
          remainingSeconds: getRemainingSecondsAt(
            runtime.remainingAtStart,
            runtime.startedAt,
          ),
          status: "stopped",
        })),
      };
    });
  },

  toggleStartStop: (id) => {
    const timer = get().timers.find((item) => item.id === id);
    if (!timer) {
      return;
    }

    if (timer.status === "running") {
      get().stopTimer(id);
      return;
    }

    get().startTimer(id);
  },

  resetTimer: (id) => {
    set((state) => ({
      runtimeByTimerId: clearRuntime(state.runtimeByTimerId, id),
      timers: updateTimer(state.timers, id, (timer) => ({
        ...timer,
        remainingSeconds: timer.initialSeconds,
        sessionTotalSeconds: timer.initialSeconds,
        status: "stopped",
      })),
    }));
  },

  addSeconds: (id, seconds) => {
    let added = false;

    set((state) => {
      const timer = state.timers.find((item) => item.id === id);
      if (timer?.status !== "stopped") {
        return state;
      }

      const nextRemaining = timer.remainingSeconds + seconds;
      if (nextRemaining > MAX_TIMER_SECONDS) {
        return state;
      }

      added = true;
      return {
        timers: updateTimer(state.timers, id, (current) => ({
          ...current,
          remainingSeconds: nextRemaining,
          sessionTotalSeconds: nextRemaining,
        })),
      };
    });

    return added;
  },

  editTimer: (id, seconds) => {
    set((state) => ({
      runtimeByTimerId: clearRuntime(state.runtimeByTimerId, id),
      timers: updateTimer(state.timers, id, (timer) => ({
        ...timer,
        initialSeconds: seconds,
        remainingSeconds: seconds,
        sessionTotalSeconds: seconds,
        status: "stopped",
      })),
    }));
  },

  tick: () => {
    set((state) => {
      const now = Date.now();
      let runtimeByTimerId = state.runtimeByTimerId;
      let changed = false;

      const timers = state.timers.map((timer): Timer => {
        if (timer.status !== "running") return timer;

        const runtime = runtimeByTimerId[timer.id];
        if (!runtime) return timer;

        const remaining = getRemainingSecondsAt(
          runtime.remainingAtStart,
          runtime.startedAt,
          now,
        );

        if (remaining === timer.remainingSeconds) return timer;

        changed = true;

        if (remaining === 0) {
          runtimeByTimerId = clearRuntime(runtimeByTimerId, timer.id);
          return {
            ...timer,
            remainingSeconds: 0,
            status: "completed",
          };
        }

        return { ...timer, remainingSeconds: remaining };
      });

      if (!changed) return state;

      return { timers, runtimeByTimerId };
    });
  },
}));

export function resetTimerStore() {
  useTimerStore.setState({
    ...initialState,
    timers: [createTimer()],
  });
}
