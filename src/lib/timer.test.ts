import { describe, expect, test } from "vitest";
import { formatRemainingSeconds } from "@/lib/timer";

describe("formatRemainingSeconds", () => {
  test("残り秒数を Google タイマー風に整形する", () => {
    expect(formatRemainingSeconds(59)).toBe("0:59");
    expect(formatRemainingSeconds(60)).toBe("1:00");
    expect(formatRemainingSeconds(3661)).toBe("1:01:01");
  });
});
