import { Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Hash } from "lucide-react";
import { PageLayout } from "@/app/page-layout";
import { cardClassName } from "@/app/ui";

const demos = [
  {
    description:
      "コンポーネント外のストアで数値を管理します。+1 とリセットを試してください。",
    href: "/counter",
    icon: Hash,
    title: "Zustand",
  },
  {
    description:
      "Zod による検証と React Hook Form による送信処理を確認できます。",
    href: "/form",
    icon: ClipboardList,
    title: "React Hook Form + Zod",
  },
] as const;

export function HomePage() {
  return (
    <PageLayout
      description="TanStack Router でページを切り替えながら、同梱ライブラリのデモを試せます。"
      title="デモ一覧"
    >
      <ul className="space-y-3">
        {demos.map((demo) => (
          <li key={demo.href}>
            <Link
              aria-label={`${demo.title} デモを開く`}
              className={`${cardClassName} group flex items-start gap-4 transition-[border-color,box-shadow] duration-150 hover:border-zinc-300 hover:shadow-md dark:hover:border-zinc-700`}
              to={demo.href}
            >
              <demo.icon
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-amber-500 dark:text-amber-400"
              />
              <span className="min-w-0 flex-1 space-y-1">
                <span className="block font-semibold text-zinc-900 dark:text-zinc-50">
                  {demo.title}
                </span>
                <span className="block text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {demo.description}
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0 text-zinc-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
              />
            </Link>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
