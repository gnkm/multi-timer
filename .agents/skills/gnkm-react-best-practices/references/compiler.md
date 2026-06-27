# React Compiler とメモ化

出典: [React Compiler](https://ja.react.dev/learn/react-compiler) / [設定](https://ja.react.dev/reference/react-compiler/configuration)

React Compiler はビルド時に働く最適化ツールで、コンポーネントと値に**自動でメモ化**を適用する。これにより手動の `useMemo` / `useCallback` / `React.memo` が多くの場合不要になる。

## 基本方針

- **Compiler が有効なプロジェクトでは、手動メモ化（`useMemo` / `useCallback` / `memo`）をデフォルトで書かない**。
- 最適化は Compiler に任せ、コードは「素直に」書く。早すぎる手動最適化は読みにくさを生む。
- Compiler が正しく動く前提は [React のルール](rules.md)を守ること（純粋性・フックのルール）。ルール違反があると最適化対象から外れる。

## 手動メモ化が要る例外

Compiler 導入後も手動メモ化が必要になり得るのは、主に Compiler の管理外に値が出ていく場合:

- メモ化された値を**外部ライブラリ**へ渡し、そのライブラリが参照同一性に依存している。
- Compiler 未導入・部分導入のコードベースで、計測の結果ボトルネックが確認できた箇所。

手動でメモ化する場合は、まず計測してから適用する。「重い計算かどうか」は `console.time` などで実測する（`1ms` 以上が目安）。`useMemo` は初回レンダーを速くはせず、更新時の再計算をスキップするためのもの。計測手段やメモ化以外の最適化（応答性・コード分割など）は [performance.md](performance.md) を参照。

## 段階的導入

- 既存コードベースには一括ではなく段階的に導入できる。
- 関数単位で挙動を制御するディレクティブがある:
  - `"use memo"`: その関数を明示的に最適化対象にする。
  - `"use no memo"`: その関数を最適化から除外する（問題切り分け・一時退避用）。
- 詳細は [段階的な導入](https://ja.react.dev/learn/react-compiler/incremental-adoption) と [Directives](https://ja.react.dev/reference/react-compiler/directives)。

## デバッグ

- 期待通り動かないときは [デバッグガイド](https://ja.react.dev/learn/react-compiler/debugging) を参照し、コンパイラエラー（ビルド時）とランタイムエラーを切り分ける。
- ランタイムの不具合は、たいていルール違反（純粋でないレンダー、ミューテーション）が原因。`StrictMode` と ESLint プラグインで検出する。

## 判断フロー

```
パフォーマンス最適化したい
  └─ Compiler は有効か？
       ├─ はい → まず何も足さない（素直に書く）。問題が計測で確認できたら個別対応
       └─ いいえ → 計測 → ボトルネックのみ useMemo / useCallback / memo を最小限に適用
```
