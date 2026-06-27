import { describe, expect, test } from "vitest";
import {
  formatRemainingSeconds,
  getProgressAt,
  getStoppedProgress,
} from "@/lib/timer";

describe("formatRemainingSeconds", () => {
  test("残り秒数を Google タイマー風に整形する", () => {
    expect(formatRemainingSeconds(59)).toBe("0:59");
    expect(formatRemainingSeconds(60)).toBe("1:00");
    expect(formatRemainingSeconds(3661)).toBe("1:01:01");
  });
});

describe("getProgressAt", () => {
  test("開始直後は 1、終了時は 0 になる", () => {
    const startedAt = 1_000_000;

    expect(getProgressAt(60, startedAt, startedAt)).toBe(1);
    expect(getProgressAt(60, startedAt, startedAt + 30_000)).toBe(0.5);
    expect(getProgressAt(60, startedAt, startedAt + 60_000)).toBe(0);
  });

  test("initialSeconds より長い remainingAtStart でも進捗が減る", () => {
    const startedAt = 1_000_000;

    expect(getProgressAt(120, startedAt, startedAt)).toBe(1);
    expect(getProgressAt(120, startedAt, startedAt + 30_000)).toBe(0.75);
    expect(getProgressAt(120, startedAt, startedAt + 120_000)).toBe(0);
  });
});

describe("getStoppedProgress", () => {
  test("セッション基準で停止中の進捗を返す", () => {
    expect(getStoppedProgress(70, 35)).toBe(0.5);
    expect(getStoppedProgress(5, 1)).toBe(0.2);
  });

  test("残り 0 秒のときは 0 を返す", () => {
    expect(getStoppedProgress(60, 0)).toBe(0);
  });
});
