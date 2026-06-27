import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { MAX_TIMER_SECONDS } from "@/lib/timer";
import { resetTimerStore, useTimerStore } from "@/stores/timer-store";

describe("useTimerStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetTimerStore();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("初期状態は 1:00 のタイマーが 1 件", () => {
    const { timers } = useTimerStore.getState();

    expect(timers).toHaveLength(1);
    expect(timers[0]?.initialSeconds).toBe(60);
    expect(timers[0]?.remainingSeconds).toBe(60);
    expect(timers[0]?.status).toBe("stopped");
  });

  test("addTimer でタイマーを追加できる", () => {
    useTimerStore.getState().addTimer();

    expect(useTimerStore.getState().timers).toHaveLength(2);
  });

  test("最後の 1 件は削除できない", () => {
    const id = useTimerStore.getState().timers[0]?.id;
    if (!id) {
      throw new Error("timer id not found");
    }

    useTimerStore.getState().removeTimer(id);

    expect(useTimerStore.getState().timers).toHaveLength(1);
  });

  test("start / stop で status と残り時間を更新する", () => {
    const id = useTimerStore.getState().timers[0]?.id;
    if (!id) {
      throw new Error("timer id not found");
    }

    useTimerStore.getState().startTimer(id);
    expect(useTimerStore.getState().timers[0]?.status).toBe("running");

    vi.advanceTimersByTime(3000);
    useTimerStore.getState().stopTimer(id);

    const timer = useTimerStore.getState().timers[0];
    expect(timer?.status).toBe("stopped");
    expect(timer?.remainingSeconds).toBe(57);
  });

  test("残り 0 秒と完了状態では開始できない", () => {
    const id = useTimerStore.getState().timers[0]?.id;
    if (!id) {
      throw new Error("timer id not found");
    }

    useTimerStore.setState({
      timers: [
        {
          id,
          initialSeconds: 0,
          remainingSeconds: 0,
          sessionTotalSeconds: 0,
          status: "stopped",
        },
      ],
    });
    useTimerStore.getState().startTimer(id);
    expect(useTimerStore.getState().timers[0]?.status).toBe("stopped");

    useTimerStore.setState({
      timers: [
        {
          id,
          initialSeconds: 10,
          remainingSeconds: 0,
          sessionTotalSeconds: 10,
          status: "completed",
        },
      ],
    });
    useTimerStore.getState().startTimer(id);
    expect(useTimerStore.getState().timers[0]?.status).toBe("completed");
  });

  test("resetTimer で初期値に戻して停止する", () => {
    const id = useTimerStore.getState().timers[0]?.id;
    if (!id) {
      throw new Error("timer id not found");
    }

    useTimerStore.setState({
      timers: [
        {
          id,
          initialSeconds: 60,
          remainingSeconds: 42,
          sessionTotalSeconds: 60,
          status: "completed",
        },
      ],
    });

    useTimerStore.getState().resetTimer(id);

    const timer = useTimerStore.getState().timers[0];
    expect(timer?.remainingSeconds).toBe(60);
    expect(timer?.status).toBe("stopped");
  });

  test("addSeconds は停止中のみ加算し、上限超過時は false", () => {
    const id = useTimerStore.getState().timers[0]?.id;
    if (!id) {
      throw new Error("timer id not found");
    }

    const added = useTimerStore.getState().addSeconds(id, 10);
    expect(added).toBe(true);
    expect(useTimerStore.getState().timers[0]?.remainingSeconds).toBe(70);

    useTimerStore.getState().startTimer(id);
    const rejectedWhileRunning = useTimerStore.getState().addSeconds(id, 10);
    expect(rejectedWhileRunning).toBe(false);

    useTimerStore.getState().stopTimer(id);
    useTimerStore.setState({
      timers: [
        {
          id,
          initialSeconds: MAX_TIMER_SECONDS,
          remainingSeconds: MAX_TIMER_SECONDS - 5,
          sessionTotalSeconds: MAX_TIMER_SECONDS - 5,
          status: "stopped",
        },
      ],
    });

    const rejectedAtMax = useTimerStore.getState().addSeconds(id, 10);
    expect(rejectedAtMax).toBe(false);
    expect(useTimerStore.getState().timers[0]?.remainingSeconds).toBe(
      MAX_TIMER_SECONDS - 5,
    );
  });

  test("editTimer で設定を更新して停止状態にする", () => {
    const id = useTimerStore.getState().timers[0]?.id;
    if (!id) {
      throw new Error("timer id not found");
    }

    useTimerStore.setState({
      timers: [
        {
          id,
          initialSeconds: 60,
          remainingSeconds: 10,
          sessionTotalSeconds: 60,
          status: "completed",
        },
      ],
    });

    useTimerStore.getState().editTimer(id, 120);

    const timer = useTimerStore.getState().timers[0];
    expect(timer?.initialSeconds).toBe(120);
    expect(timer?.remainingSeconds).toBe(120);
    expect(timer?.status).toBe("stopped");
  });

  test("再開後の停止でも sessionTotalSeconds を基準に進捗を保つ", () => {
    const id = useTimerStore.getState().timers[0]?.id;
    if (!id) {
      throw new Error("timer id not found");
    }

    useTimerStore.getState().startTimer(id);
    vi.advanceTimersByTime(55_000);
    useTimerStore.getState().stopTimer(id);
    expect(useTimerStore.getState().timers[0]?.remainingSeconds).toBe(5);

    useTimerStore.getState().addSeconds(id, 60);
    useTimerStore.getState().startTimer(id);
    vi.advanceTimersByTime(10_000);
    useTimerStore.getState().stopTimer(id);

    const timer = useTimerStore.getState().timers[0];
    expect(timer?.remainingSeconds).toBe(55);
    expect(timer?.sessionTotalSeconds).toBe(65);
  });
});
