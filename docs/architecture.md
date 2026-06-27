# Multi Timer Architecture

仕様は [org.md](./org.md) を参照。技術スタックは React 19.2（React Compiler 有効）/ Zustand / Tailwind v4 / react-hook-form + zod / lucide-react。

## ディレクトリ構成

`src/` 以下は役割で分ける。UI は `components/`、共有 state は `stores/`、副作用は `hooks/`、UI に依存しないロジックは `lib/` に置く。

```
src/
├── main.tsx                        # エントリポイント
├── app/
│   └── app.tsx                     # 組み立て・副作用 hook の起点
├── components/
│   ├── layout/
│   │   └── app-shell.tsx           # 全画面の外枠（背景など）
│   ├── app-header/
│   │   ├── app-header.tsx
│   │   ├── add-timer-button.tsx
│   │   └── theme-toggle-button.tsx
│   ├── timer/
│   │   ├── timer-card-list.tsx
│   │   ├── timer-card.tsx
│   │   ├── progress-ring.tsx
│   │   ├── timer-display.tsx
│   │   ├── timer-controls.tsx
│   │   └── timer-edit-form.tsx
│   └── maximized-timer-view.tsx
├── hooks/
│   ├── use-timer-tick.ts
│   ├── use-completion-favicon.ts
│   └── use-escape-to-minimize.ts
├── lib/                            # 純関数・定数・zod スキーマなど
├── stores/                         # Zustand ストア
├── types/                          # ドメイン型
├── styles/
└── test/                           # テスト用セットアップ
```

### 各ディレクトリの責務

| ディレクトリ | 入れるもの |
| --- | --- |
| `app/` | `App` のみ。子コンポーネントを並べ、hook を呼ぶ |
| `components/` | 見た目・UI。下記コンポーネント木に対応 |
| `hooks/` | カウントダウン tick、favicon、キーボードなどの副作用 |
| `lib/` | 時間計算、定数、フォーム検証スキーマなど |
| `stores/` | `timers` と UI state（最大化・編集・テーマ） |
| `types/` | `Timer` などドメイン型 |

### 命名

- ファイル名: `kebab-case.tsx`（例: `timer-card.tsx`）
- コンポーネント名: `PascalCase`（例: `TimerCard`）
- テスト: 対象ファイルの隣に `*.test.tsx` を置く

### コンポーネントとパスの対応

| コンポーネント | パス |
| --- | --- |
| `App` | `app/app.tsx` |
| `AppShell` | `components/layout/app-shell.tsx` |
| `AppHeader` | `components/app-header/app-header.tsx` |
| `AddTimerButton` | `components/app-header/add-timer-button.tsx` |
| `ThemeToggleButton` | `components/app-header/theme-toggle-button.tsx` |
| `TimerCardList` | `components/timer/timer-card-list.tsx` |
| `TimerCard` | `components/timer/timer-card.tsx` |
| `ProgressRing` | `components/timer/progress-ring.tsx` |
| `TimerDisplay` | `components/timer/timer-display.tsx` |
| `TimerControls` | `components/timer/timer-controls.tsx` |
| `TimerEditForm` | `components/timer/timer-edit-form.tsx` |
| `MaximizedTimerView` | `components/maximized-timer-view.tsx` |

## コンポーネント

```
App (layout)
├─ AppHeader
│   ├─ AddTimerButton          「+」でタイマー追加
│   └─ ThemeToggleButton       ライト/ダーク切替
├─ TimerCardList               レスポンシブグリッド
│   └─ TimerCard               1 タイマー（status で見た目を分岐）
│       ├─ ProgressRing        12時から反時計回りの円形プログレス
│       ├─ TimerDisplay        残り時間表示（H:MM:SS / MM:SS）
│       ├─ TimerControls       開始/停止・リセット・最大化・削除・編集・+0:10・+1:00
│       └─ TimerEditForm       編集 UI（Google タイマー風 / 実行中は非表示・不可）
└─ MaximizedTimerView          最大化中のみ表示（オーバーレイ。TimerCard を大表示で再利用）
```

### 各コンポーネントの責務

| コンポーネント | 責務 |
| --- | --- |
| `App` | レイアウトと全体の組み立て。UI state（最大化中の ID 等）と副作用 hook の起点 |
| `AppHeader` | ヘッダ。追加ボタンとテーマ切替を配置 |
| `AddTimerButton` | 「+」でタイマーを 1 件追加（初期時間 1:00） |
| `ThemeToggleButton` | ライト/ダークをアプリ内トグルで切替 |
| `TimerCardList` | timers を `map()` し、`key={timer.id}` でグリッド表示 |
| `TimerCard` | 1 タイマーの表示。`status` で見た目（通常/実行中/完了）を分岐 |
| `ProgressRing` | 進捗率を円形プログレスで描画（12 時から反時計回りに減少） |
| `TimerDisplay` | 残り秒を `H:MM:SS` / `MM:SS` に整形して表示 |
| `TimerControls` | 操作ボタン群。`+0:10` / `+1:00` は停止中のみ活性、上限超過時はインラインメッセージ |
| `TimerEditForm` | 編集フォーム。`react-hook-form` + `zod` で 1 秒単位・上限 99:59:59 を検証 |
| `MaximizedTimerView` | 最大化表示。最小化ボタン / Esc で一覧に戻る |

## State

timers はアプリ全体で共有するため Zustand ストアに集約する。UI state（最大化・編集対象・テーマ）はストア／アプリ側で別管理する。

```ts
type TimerStatus = 'stopped' | 'running' | 'completed';

type Timer = {
  id: string;
  initialSeconds: number;   // リセット先
  remainingSeconds: number; // 残り
  status: TimerStatus;
};
```

設計原則:

- 排他状態（実行中/完了）は別フラグにせず `status` 1 つで表す（矛盾する state を避ける）。
- UI state（`maximizedTimerId` / `editingTimerId` / `theme`）は timers と分離して持つ。
- イミュータブル更新（追加は `[...timers, t]`、削除は `filter`、更新は `map`）。

### 派生値（state にしない / レンダー中に計算）

| 派生値 | 用途 | 算出 |
| --- | --- | --- |
| 進捗率 | `ProgressRing` | `remainingSeconds / initialSeconds` |
| 表示文字列 | `TimerDisplay` | `remainingSeconds` を整形 |
| いずれか完了か | favicon / タブ | `timers.some(t => t.status === 'completed')` |
| 削除可否 | `TimerControls` | `timers.length > 1` |

## カウントダウン

- タイマーごとに `setInterval` を持たず、**中央で 1 本の tick** にまとめて精度劣化（ドリフト）を防ぐ。
- 残り時間はカウント回数ではなく **`Date.now()` の差分（タイムスタンプ基準）**で算出する。
- 0 到達で `status = 'completed'`。完了時の色変更は `status` 由来のレンダーで表現し、命令的 DOM 操作はしない。
- 複数タイマーは同時に実行できる。

## 副作用（hook に分離）

外部システムとの同期は Effect / カスタム hook に置く。

| hook | 役割 |
| --- | --- |
| `useTimerTick` | 中央の tick。`running` のタイマーを `Date.now()` 基準で更新し、0 で完了へ |
| `useCompletionFavicon` | いずれか完了で favicon / タブを完了表示、全解除で通常へ戻す |
| `useEscapeToMinimize` | Esc キー購読で最大化を解除 |

## 補足・方針

- React Compiler が有効なので `useMemo` / `useCallback` / `memo` は原則書かない。
- リストの `key` は配列インデックスではなく `timer.id` を使う。
- 永続化なし（リロードでリセット）。
- 完了状態はリセット・編集など任意の操作で解除する（スタートでは解除しない）。
- 設定タイマーが 1 個のときは削除ボタンを無効化する。
