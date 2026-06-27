import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { App } from "@/app/app";

describe("App", () => {
  test("タイトルを表示する", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Multi Timer" }),
    ).toBeInTheDocument();
  });
});
