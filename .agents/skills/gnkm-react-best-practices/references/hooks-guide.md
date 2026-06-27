# フック選択ガイド（React 19.2）

出典: [フック一覧](https://ja.react.dev/reference/react/hooks)

全 API の詳細は複製しない。「何をしたいか」から使うフックを選ぶための早見表。正確なシグネチャは各リンク先で確認する。フックは必ず [rules.md](rules.md) のフックのルールに従って呼ぶ。

## 早見表

| やりたいこと | フック | リンク |
|---|---|---|
| ローカルな UI state を持つ | `useState` | https://ja.react.dev/reference/react/useState |
| 複雑／多数の更新を action に集約 | `useReducer` | https://ja.react.dev/reference/react/useReducer |
| 深い階層へ値を配る（prop drilling 回避） | `useContext` | https://ja.react.dev/reference/react/useContext |
| 外部システムと同期する | `useEffect` | https://ja.react.dev/reference/react/useEffect |
| 再レンダーを起こさず値を保持／DOM 参照 | `useRef` | https://ja.react.dev/reference/react/useRef |
| 重い計算をメモ化（Compiler 無効時） | `useMemo` | https://ja.react.dev/reference/react/useMemo |
| 関数の参照をメモ化（Compiler 無効時） | `useCallback` | https://ja.react.dev/reference/react/useCallback |
| Promise や Context を読む（条件分岐内でも可） | `use` | https://ja.react.dev/reference/react/use |
| フォーム送信＋保留・結果 state を管理 | `useActionState` | https://ja.react.dev/reference/react/useActionState |
| 楽観的更新（送信中に先に UI を更新） | `useOptimistic` | https://ja.react.dev/reference/react/useOptimistic |
| 重い更新を非緊急扱いにして UI を保つ | `useTransition` | https://ja.react.dev/reference/react/useTransition |
| 値の反映を遅延させ入力の応答性を保つ | `useDeferredValue` | https://ja.react.dev/reference/react/useDeferredValue |
| 外部ストアを購読する | `useSyncExternalStore` | https://ja.react.dev/reference/react/useSyncExternalStore |
| Effect 内で最新値を読みつつ再実行を防ぐ | `useEffectEvent` | https://ja.react.dev/reference/react/useEffectEvent |
| 一意な ID を生成（アクセシビリティ属性等） | `useId` | https://ja.react.dev/reference/react/useId |
| DOM 反映前に同期実行（レイアウト測定） | `useLayoutEffect` | https://ja.react.dev/reference/react/useLayoutEffect |

`useActionState` / `useFormStatus` などフォーム関連は Server Functions と組み合わせることが多い（[server-components.md](server-components.md)）。`useFormStatus` は `react-dom` 提供。

## 選択時の注意

- **まず state を最小化**してからフックを選ぶ（[thinking-in-react.md](thinking-in-react.md) ステップ 3）。派生値はフックではなくレンダー中の計算で済むことが多い。
- **`useMemo` / `useCallback` は安易に使わない**。React Compiler 有効時は原則不要（[compiler.md](compiler.md)）。
- **`useEffect` の前に「本当に必要か」を確認**する（[effects-and-refs.md](effects-and-refs.md)）。データ変換・イベント処理には使わない。
- 状態更新の応答性問題は、`useTransition`（更新を非緊急化）か `useDeferredValue`（値の反映を遅延）で解く。最適化全般は [performance.md](performance.md)。
- フォーム＋非同期処理は `useActionState` + `useOptimistic` の組み合わせが React 19 の定石。

## レガシー・非推奨

新規コードでは原則使わない（既存保守を除く）。

- クラスコンポーネントのライフサイクル → 関数コンポーネント＋フック
- `forwardRef` で ref を受け渡す → React 19 では `ref` を通常 props として渡せる
- レガシー Context API（`contextTypes` 等）→ `createContext` + `useContext`

迷ったら [https://ja.react.dev/reference/react/hooks](https://ja.react.dev/reference/react/hooks) の分類（State / Context / Ref / Effect / Performance / その他）を確認する。
