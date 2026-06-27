import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { HomePage } from "@/app/pages/home-page";

describe("HomePage", () => {
  test("タイトルを表示する", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "Multi Timer" }),
    ).toBeInTheDocument();
  });
});
