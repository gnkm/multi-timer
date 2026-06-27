import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { renderWithRouter } from "@/test/render-with-router";

describe("Router", () => {
  test("ホームから Zustand デモへ遷移できる", async () => {
    const user = userEvent.setup();

    await renderWithRouter("/");

    expect(
      screen.getByRole("heading", { name: "デモ一覧" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Zustand デモを開く" }));

    expect(
      screen.getByRole("heading", { name: "Zustand（クライアント状態）" }),
    ).toBeInTheDocument();
  });

  test("Zustand の値はページ遷移後も保持される", async () => {
    const user = userEvent.setup();

    await renderWithRouter("/counter");

    await user.click(screen.getByRole("button", { name: "+1 する" }));
    expect(
      screen.getByRole("status", { name: "カウンター" }),
    ).toHaveTextContent("1");

    await user.click(screen.getByRole("link", { name: "Form" }));
    await user.click(screen.getByRole("link", { name: "Zustand" }));

    expect(
      screen.getByRole("status", { name: "カウンター" }),
    ).toHaveTextContent("1");
  });
});
