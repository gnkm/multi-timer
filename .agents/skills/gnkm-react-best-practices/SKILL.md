---
name: gnkm-react-best-practices
description: >
  React 19.2 の公式ベストプラクティス（React の流儀）に沿ってコンポーネント設計、
  state 管理、Effect、Server Components、React Compiler の判断を支援する。
  新規 UI 実装・コンポーネント分割・state 設計・React / フック / JSX / RSC の
  実装・レビュー・リファクタ時に使用する。
license: MIT
metadata:
  react-version: "19.2"
  docs-source: "https://ja.react.dev"
---

# React ベストプラクティス（v19.2）

[ja.react.dev](https://ja.react.dev) v19.2 に準拠して React コードを設計・実装・レビューするためのスキル。React の基礎知識（JSX とは何か等）は前提とし、**判断を誤りやすい点**と**公式が推奨する手順**に絞って案内する。

## 適用タイミング

次のいずれかに該当したら、このスキルを使う。

- 新しい画面・機能・コンポーネントを設計／実装する
- 「コンポーネントをどう分割するか」「state をどこに置くか」を判断する
- `useState` / `useReducer` / `useEffect` / `useContext` / `useMemo` などフックの選択に迷う
- Server Components（RSC）や `"use client"` の境界を決める
- React Compiler 環境でメモ化（`useMemo` / `useCallback` / `memo`）の要否を判断する
- 既存 React コードをレビュー・リファクタする

## 作業フロー

新規 UI 実装は [React の流儀](https://ja.react.dev/learn/thinking-in-react) の 5 ステップを起点にする。詳細手順は `references/thinking-in-react.md` を参照。

1. UI をコンポーネント階層に分割する（関心の分離・1 コンポーネント 1 責務）
2. state なしの静的バージョンを先に作る（props だけでレンダー）
3. 最小かつ完全な UI state を見つける（派生値・props・不変値は state にしない）
4. state を保持する場所を特定する（利用側の最も近い共通の親へリフトアップ）
5. 逆方向データフローを追加する（子はコールバックで親の setter を呼ぶ）

実装・レビュー時のチェックリスト:

- [ ] `references/rules.md` の React のルールに反していないか
- [ ] state は最小か（既存の値から計算できるものを state にしていないか）
- [ ] Effect を「データ変換」「ユーザイベント処理」に使っていないか（`references/effects-and-refs.md`）
- [ ] フックをトップレベルで呼んでいるか（条件・ループ・early return より後で呼んでいないか）
- [ ] props / state を直接ミューテートしていないか

## 意思決定ツリー

| 判断したいこと | 指針 |
|---|---|
| ユーザ操作への反応 | イベントハンドラに書く。Effect は使わない |
| 既存 state/props から導ける値 | レンダー中に計算する。state にも Effect にもしない |
| 外部システムとの同期（購読・DOM・ネットワーク接続） | Effect を使う |
| 複数コンポーネントで共有する state | 共通の親へリフトアップ → 深い場合は Context、複雑なら Reducer + Context |
| サーバ専用データの取得 | async な Server Component。インタラクティブ部分だけ `"use client"` で分離 |
| メモ化 | React Compiler を優先。手動の `useMemo`/`useCallback`/`memo` は原則書かない |
| 再レンダーを起こさず値を保持 | `useRef`（state ではない） |
| 重い更新で UI が固まる／初期ロードが重い | まず計測。`useTransition`/`useDeferredValue`/`lazy`+`Suspense`/`Activity`（`references/performance.md`） |

## 参照ファイルの読み込み条件

タスクに応じて以下を必要時に読む（progressive disclosure）。常時すべてを読み込まない。

| 状況 | 読むファイル |
|---|---|
| 新規 UI・機能の設計／実装を始める | `references/thinking-in-react.md` |
| 実装・レビューを始める（常に最初に確認） | `references/rules.md` |
| コンポーネント分割・JSX・props・条件分岐・リスト | `references/components-and-jsx.md` |
| state の最小化・リフトアップ・共有を設計する | `references/state.md`（設計順序は `thinking-in-react.md` のステップ 3〜5） |
| `useState` / `useReducer` / `useContext` を使う | `references/state.md` |
| `useEffect` / `useRef` / カスタムフックを使う | `references/effects-and-refs.md` |
| RSC / `"use client"` / サーバでのデータ取得 | `references/server-components.md` |
| メモ化の要否（Compiler 方針） | `references/compiler.md` |
| 計測・応答性・コード分割・リソース読み込み・Activity | `references/performance.md` |
| どのフックを選ぶか迷う | `references/hooks-guide.md` |

## 公式ドキュメントの確認

API の正確なシグネチャや最新の挙動が不確かな場合は、推測せず公式リファレンスを確認する。

- 該当 API: `https://ja.react.dev/reference/react/<API名>`（例: `https://ja.react.dev/reference/react/useState`）
- 概念・チュートリアル: `https://ja.react.dev/learn/...`
- ドキュメント取得が必要なら `find-docs` スキルや `ctx7` CLI を使う

バージョンは React 19.2 を前提とする。古い API（クラスコンポーネント、`forwardRef` 必須の旧 ref 受け渡し、レガシー Context など）は、既存コードの保守時を除き新規採用しない。
