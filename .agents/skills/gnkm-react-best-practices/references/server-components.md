# Server Components と "use client"

出典: [サーバコンポーネント](https://ja.react.dev/reference/rsc/server-components) / [ディレクティブ](https://ja.react.dev/reference/rsc/directives)

React 19 の Server Components（RSC）は安定。ただし RSC を成立させる土台は通常フレームワーク（Next.js App Router 等）が提供する。**実装の詳細は利用中フレームワークのドキュメントに従う**。ここではフレームワーク非依存の判断基準のみ扱う。

## Server と Client の違い

| | Server Component | Client Component |
|---|---|---|
| 実行場所 | ビルド時 or サーバ（リクエスト時） | サーバ（SSR）＋ブラウザ |
| できること | `async`/`await` でデータ取得、サーバ専用リソース（DB・ファイル）参照 | state・Effect・イベント・ブラウザ API |
| できないこと | `useState`・`useEffect`・イベントハンドラ・ブラウザ API | サーバ専用リソースへの直接アクセス |
| バンドル | クライアントへ送られない（依存ライブラリも） | クライアントへ送られる |

デフォルトは Server Component。**インタラクティブな部分だけ** Client にする。

## "use client" の使いどころ

ファイル先頭に `"use client"` を書くと、そのファイルとそこから import されるモジュールが Client 側になる（Server と Client の境界を定義する）。

`"use client"` が必要なのは次を使うとき:

- `useState` / `useReducer` / `useEffect` などのフック
- `onClick` / `onChange` などのイベントハンドラ
- ブラウザ API（`window`・`localStorage`・DOM）

```jsx
"use client";
import { useState } from 'react';

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? '♥' : '♡'}</button>;
}
```

## 設計の指針

- **Server に state を置かない**。インタラクティブ UI は小さな Client Component に切り出し、静的部分は Server のまま保つ。
- 境界は**できるだけ葉（末端）に寄せる**。ページ全体を `"use client"` にせず、ボタンや入力など必要な部品だけ Client にする。
- Server Component は Client Component を**子として**レンダーしたり、`children` や props として渡せる。逆に Client Component は Server Component を import できない（props 経由で受け取る）。
- Client へ渡す props は**シリアライズ可能**な値にする（関数やクラスインスタンスは渡せない。Server Functions は例外）。

## async な Server Component でのデータ取得

Server Component は `async` にでき、レンダー内で直接 `await` できる。クライアント fetch + `useEffect` のような往復が不要になり、データ取得用ライブラリをクライアントバンドルから外せる。

```jsx
// Server Component（"use client" なし）
import { db } from './database.js';

async function Note({ id }) {
  const note = await db.notes.get(id);
  return <article>{note.content}</article>;
}
```

- クライアントで取得済みのデータを読むだけなら、Client 側で [`use(promise)`](hooks-guide.md) や Suspense と組み合わせる。
- ストリーミングや段階的表示には `<Suspense>` を使い、`fallback` を指定する。

## ディレクティブ

- `"use client"`: Server/Client 境界を定義し、クライアント側エントリを示す。
- `"use server"`: Server Functions（サーバアクション）を定義する（クライアントから呼べるサーバ関数）。クライアントコードを示す `"use client"` とは目的が異なるので混同しない。

詳細・正確な制約は [https://ja.react.dev/reference/rsc/directives](https://ja.react.dev/reference/rsc/directives) と利用中フレームワークのドキュメントを確認する。
