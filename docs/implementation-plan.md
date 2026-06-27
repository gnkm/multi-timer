# Multi Timer 実装計画

おおまかな実装順序。仕様は [org.md](./org.md)、構成は [architecture.md](./architecture.md) を参照。

「React の流儀」に沿って **静的 UI → state → 副作用** の順で進める。各ステップの末尾で動作確認すると手戻りが減る。

## 実装順序

1. **土台・型・ストア**: `Timer` 型と Zustand ストア（追加 / 削除 / 開始停止 / リセット / 加算 / 編集のアクション）を用意。
2. **静的 UI**: ダミーデータで `App → AppHeader → TimerCardList → TimerCard（ProgressRing / TimerDisplay / TimerControls）` を props だけで描画。
3. **基本操作の接続**: 追加・削除・リセット・開始 / 停止をストアと繋ぐ（カウントダウンはまだ無し）。
4. **カウントダウン**: `useTimerTick`（中央 1 本・`Date.now()` 基準）で残り時間更新と 0 到達 → 完了。
5. **時間操作・上限**: `+0:10` / `+1:00`、上限 99:59:59 と超過時のインラインメッセージ。
6. **編集**: `TimerEditForm`（react-hook-form + zod、実行中不可）。
7. **完了の表現**: 色変更（status 由来）と `useCompletionFavicon`、完了解除条件。
8. **最大化**: `MaximizedTimerView` と `useEscapeToMinimize`。
9. **テーマ・仕上げ**: `ThemeToggleButton`、レスポンシブグリッド、見た目の調整。

## ポイント

- ステップ 2 で静的版を完成させてから、3 以降で state と副作用を足す。
- 派生値（進捗率・表示文字列・完了判定・削除可否）は state にせず、レンダー中に計算する。
- カウントダウンはタイマー個別の `setInterval` を避け、中央 1 本の tick + `Date.now()` 基準にする。
