import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { CounterPage } from "@/app/pages/counter-page";

describe("CounterPage", () => {
  test("カウンターを増やしてリセットできる", async () => {
    const user = userEvent.setup();

    render(<CounterPage />);

    const counter = screen.getByRole("status", { name: "カウンター" });

    expect(counter).toHaveTextContent("0");

    await user.click(screen.getByRole("button", { name: "+1 する" }));
    expect(counter).toHaveTextContent("1");

    await user.click(screen.getByRole("button", { name: "リセット" }));
    expect(counter).toHaveTextContent("0");
  });
});
