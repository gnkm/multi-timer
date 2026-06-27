import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { FormPage } from "@/app/pages/form-page";

describe("FormPage", () => {
  test("送信後に結果が表示される", async () => {
    const user = userEvent.setup();

    render(<FormPage />);

    expect(
      screen.getByText(
        "まだ送信されていません。フォームを送信すると、ここに結果が表示されます。",
      ),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText("名前"), "山田 太郎");
    await user.click(screen.getByRole("button", { name: "送信する" }));

    expect(screen.getByText("送信成功")).toBeInTheDocument();
    expect(screen.getByText(/「山田 太郎」/)).toBeInTheDocument();
  });

  test("空送信でバリデーションエラーが表示される", async () => {
    const user = userEvent.setup();

    render(<FormPage />);

    await user.click(screen.getByRole("button", { name: "送信する" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "名前を入力してください",
    );
  });
});
