import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageLayout } from "@/app/page-layout";
import {
  buttonClassName,
  cardClassName,
  hintClassName,
  inputClassName,
} from "@/app/ui";
import { cn } from "@/lib/cn";

const nameSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
});

type NameForm = z.infer<typeof nameSchema>;

export function FormPage() {
  const [savedName, setSavedName] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setFocus,
  } = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  });

  return (
    <PageLayout
      description="React Hook Form が入力状態を管理し、Zod が送信前の検証を行います。"
      title="React Hook Form + Zod（フォーム検証）"
    >
      <section aria-labelledby="form-heading" className={cardClassName}>
        <div className="space-y-2">
          <h2
            className="text-base font-semibold text-zinc-900 dark:text-zinc-50"
            id="form-heading"
          >
            名前入力デモ
          </h2>
          <p className={hintClassName}>
            <strong className="font-medium text-zinc-800 dark:text-zinc-200">
              操作の流れ
            </strong>
            <br />
            空のまま「送信する」を押すと Zod
            のエラーが表示されます。名前を入力して送信すると、検証を通過した値が下のフィードバックに表示されます。
          </p>
        </div>

        <form
          className="mt-5 space-y-4"
          noValidate
          onSubmit={handleSubmit(
            (data) => {
              setSavedName(data.name);
              reset();
            },
            () => {
              setFocus("name");
            },
          )}
        >
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              htmlFor="name"
            >
              名前
            </label>
            <input
              aria-describedby={
                errors.name ? "name-error name-hint" : "name-hint"
              }
              aria-invalid={errors.name ? true : undefined}
              autoComplete="name"
              className={inputClassName}
              id="name"
              placeholder="例: 山田 太郎…"
              spellCheck={false}
              type="text"
              {...register("name")}
            />
            <p
              className="text-xs text-zinc-500 dark:text-zinc-400"
              id="name-hint"
            >
              1 文字以上入力してください
            </p>
            {errors.name ? (
              <p
                className="text-sm text-red-600 dark:text-red-400"
                id="name-error"
                role="alert"
              >
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <button className={cn(buttonClassName, "w-full")} type="submit">
            送信する
          </button>
        </form>

        <div aria-live="polite" className="mt-4 space-y-2">
          {savedName ? (
            <div
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/40"
              role="status"
            >
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                送信成功
              </p>
              <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
                「{savedName}」を受け取りました。Zod の検証を通過し、React Hook
                Form の <code className="text-xs">handleSubmit</code>{" "}
                が実行されました。
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              まだ送信されていません。フォームを送信すると、ここに結果が表示されます。
            </p>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
