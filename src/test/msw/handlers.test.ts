import { describe, expect, test } from "vitest";

describe("MSW", () => {
  test("/api/health がモックされる", async () => {
    const response = await fetch("/api/health");
    const body = (await response.json()) as { status: string };

    expect(response.ok).toBe(true);
    expect(body.status).toBe("ok");
  });
});
