import { PageLayout } from "@/app/page-layout";
import {
  buttonClassName,
  cardClassName,
  hintClassName,
  secondaryButtonClassName,
} from "@/app/ui";
import { useCounterStore } from "@/stores/counter-store";

export function CounterPage() {
  const { count, increment, reset } = useCounterStore();

  return (
    <PageLayout
      description="Zustand のストアがページをまたいで同じ count を共有します。別ページに移動して戻っても値は保持されます。"
      title="Zustand（クライアント状態）"
    >
      <section aria-labelledby="counter-heading" className={cardClassName}>
        <div className="space-y-2">
          <h2
            className="text-base font-semibold text-zinc-900 dark:text-zinc-50"
            id="counter-heading"
          >
            カウンターデモ
          </h2>
          <p className={hintClassName}>
            <strong className="font-medium text-zinc-800 dark:text-zinc-200">
              操作の流れ
            </strong>
            <br />
            「+1 する」で数値が増え、「リセット」で 0
            に戻ります。フォームページに移動してから戻ると、ストアの値が維持されていることを確認できます。
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              現在の値（ストア）
            </p>
            <p
              aria-label="カウンター"
              aria-live="polite"
              className="font-semibold text-4xl text-zinc-900 tabular-nums tracking-tight dark:text-zinc-50"
              role="status"
            >
              {count}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={buttonClassName}
              onClick={increment}
              type="button"
            >
              +1 する
            </button>
            <button
              className={secondaryButtonClassName}
              disabled={count === 0}
              onClick={reset}
              type="button"
            >
              リセット
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
