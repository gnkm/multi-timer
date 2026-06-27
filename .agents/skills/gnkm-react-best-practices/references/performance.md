# パフォーマンス最適化

出典: [`<Profiler>`](https://ja.react.dev/reference/react/Profiler) / [useTransition](https://ja.react.dev/reference/react/useTransition) / [useDeferredValue](https://ja.react.dev/reference/react/useDeferredValue) / [`<Suspense>`](https://ja.react.dev/reference/react/Suspense) / [lazy](https://ja.react.dev/reference/react/lazy) / [`<Activity>`](https://ja.react.dev/reference/react/Activity)

## 大原則: 計測してから最適化する

- **推測で最適化しない**。まず計測し、ボトルネックを特定してから手を入れる。
- メモ化（`useMemo` / `useCallback` / `memo`）は最初から散りばめない。React Compiler 有効時は原則不要（[compiler.md](compiler.md)）。
- 多くの「遅さ」は不要な再レンダー・不要な Effect・重い同期計算が原因。先に [state.md](state.md) / [effects-and-refs.md](effects-and-refs.md) の設計を見直す。

## 計測ツール

| ツール | 用途 |
|---|---|
| [React DevTools](https://ja.react.dev/learn/react-developer-tools) の Profiler パネル | どのコンポーネントが・なぜ・どれだけ再レンダーされたかを対話的に調べる（ブラウザ拡張） |
| [`<Profiler>`](https://ja.react.dev/reference/react/Profiler) コンポーネント | レンダー時間をプログラムで収集する |
| React Performance Tracks | ブラウザの Performance パネルに React のレンダー情報を表示（プロファイリングビルドが必要） |
| `console.time()` / `performance.now()` | 個々の計算が「重い」か実測（目安 1ms 以上ならメモ化を検討） |

### `<Profiler>` の使い方

ツリーを囲み、`id` と `onRender` を渡す。本番ビルドではデフォルト無効（オーバーヘッドがあるため必要な箇所だけに使う）。

```jsx
<Profiler id="Sidebar" onRender={onRender}>
  <Sidebar />
</Profiler>

function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // phase: "mount" | "update" | "nested-update"
  // actualDuration: 今回のレンダー実時間（メモ化が効くほど小さくなる）
  // baseDuration:   メモ化なしで全再レンダーした場合の推定時間
}
```

- `actualDuration` を `baseDuration` と比べると、メモ化が効いているか判断できる。
- `actualDuration` は初回マウント後、更新時に大きく下がるのが理想。

## 不要な再レンダーを抑える（メモ化）

Compiler 無効、かつ計測でボトルネックが確認できた場合のみ手動で適用する。

| 手段 | 効果 |
|---|---|
| [`memo`](https://ja.react.dev/reference/react/memo) | props が変わらなければ再レンダーをスキップ |
| [`useMemo`](https://ja.react.dev/reference/react/useMemo) | 重い計算結果をキャッシュ |
| [`useCallback`](https://ja.react.dev/reference/react/useCallback) | 関数の参照を固定（`memo` 化した子へ渡す時に有効） |

注意: `memo` は props の参照が毎回変わると効かない。オブジェクト/配列/関数 props は `useMemo`/`useCallback` で安定させるか、構造を見直す。詳細な方針は [compiler.md](compiler.md)。

## 応答性を保つ（重い更新でも UI を止めない）

| 状況 | 使うもの |
|---|---|
| その場で setState する重い更新を非緊急扱いにしたい | [`useTransition`](https://ja.react.dev/reference/react/useTransition) |
| 上位から来る値（props 等）の反映だけ遅らせたい | [`useDeferredValue`](https://ja.react.dev/reference/react/useDeferredValue) |

```jsx
// useTransition: 重いタブ切替を非緊急にし、保留中はインジケータ表示
const [isPending, startTransition] = useTransition();
startTransition(() => setTab(nextTab));

// useDeferredValue: 入力は即時反映、重い一覧は遅延して再レンダー
const deferredQuery = useDeferredValue(query);
const results = <SlowList query={deferredQuery} />; // 旧結果を表示しつつ背景で更新
```

- どちらも「古い表示を保ったまま、新しい結果をバックグラウンドで（中断可能に）レンダー」する。`<Suspense>` と統合され、背景更新中にフォールバックを出さない。
- デバウンス/スロットリングの自前実装より、これらのフックを優先する。

## 初期ロードとコード分割

- [`lazy`](https://ja.react.dev/reference/react/lazy) + [`<Suspense>`](https://ja.react.dev/reference/react/Suspense) でコンポーネントを動的 import し、初期バンドルを小さくする。

```jsx
const Settings = lazy(() => import('./Settings.js'));

<Suspense fallback={<Spinner />}>
  <Settings />
</Suspense>
```

- `<Suspense>` はデータ取得・遅延ロードの境界。`fallback` を指定し、読み込み中の体験を設計する。ストリーミング表示にも使う。

## リソース読み込みのヒント（react-dom）

必要になるリソースを早めにブラウザへ知らせる。レンダー中・イベントハンドラのどちらからでも呼べる。

| API | 役割 |
|---|---|
| [`prefetchDNS`](https://ja.react.dev/reference/react-dom/prefetchDNS) | ドメインの DNS 名前解決だけ先に行う |
| [`preconnect`](https://ja.react.dev/reference/react-dom/preconnect) | サーバへの接続を事前確立する |
| [`preload`](https://ja.react.dev/reference/react-dom/preload) | スタイル・フォント・スクリプト等を事前ダウンロード（`as` を指定） |
| `preinit` | ダウンロードして即時実行/挿入（スクリプト実行・スタイル適用） |

```jsx
import { preload, preinit } from 'react-dom';
preload('https://example.com/font.woff2', { as: 'font' });
```

## Activity でバックグラウンド維持・プリレンダー（React 19.2）

[`<Activity>`](https://ja.react.dev/reference/react/Activity) は UI の一部を表示/非表示にしつつ、非表示部分の **state と DOM を保持**するコンポーネント。

```jsx
<Activity mode={isActive ? 'visible' : 'hidden'}>
  <SidebarContents />
</Activity>
```

- `mode="hidden"`: `display: none` で視覚的に隠し、エフェクト（購読など）は破棄する。state と DOM は保持。
- `mode="visible"`: 以前の state を復元し、エフェクトを再作成する。
- 用途: タブ/画面切替で離れた UI の状態を失わずに保つ、**表示される可能性が高い**コンテンツを低優先度でプリレンダーして次の操作を速くする。
- 破棄（アンマウント）でなく「バックグラウンド化」したい時に使う。完全に不要なら通常どおり条件付きレンダーで外す。

## 判断の早見

```
遅い・カクつく
├─ 計測（DevTools Profiler / <Profiler>）でボトルネックを特定
├─ 入力や操作が重い更新で詰まる → useTransition / useDeferredValue
├─ 初期バンドルが大きい        → lazy + <Suspense> でコード分割
├─ 不要な再レンダーが多い      → 設計見直し → (Compiler 無効なら) memo/useMemo/useCallback
├─ リソース取得が遅い          → react-dom の preload/preconnect ほか
└─ 離れた UI の state を保ちたい / 先読みしたい → <Activity>
```
