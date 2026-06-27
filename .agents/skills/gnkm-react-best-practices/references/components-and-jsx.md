# コンポーネントと JSX

出典: [UI の記述](https://ja.react.dev/learn/describing-the-ui) / [コンポーネントを純粋に保つ](https://ja.react.dev/learn/keeping-components-pure)

## コンポーネント定義

- コンポーネント名は**大文字始まり**（`MyButton`）。小文字始まりは HTML タグと解釈される。
- 1 コンポーネント 1 責務。肥大化したら分割する。
- 関数コンポーネントはトップレベルで定義する。**コンポーネントの中でコンポーネントを定義しない**（毎レンダーで別物になり state が失われる）。

```jsx
// NG: ネスト定義（再レンダーごとに Child が作り直される）
function Parent() {
  function Child() { return <li />; }
  return <Child />;
}

// OK: トップレベルで定義
function Child() { return <li />; }
function Parent() { return <Child />; }
```

## ファイル分割（import / export）

- 1 ファイルに 1 つの主要コンポーネントを `export default` する構成を基本にする。
- 複数を出す場合は名前付き export を使う。default と名前付きは混在可能だが、ファイル内で一貫させる。

## JSX の制約

- **単一のルート要素**を返す。複数要素は `<div>...</div>` か Fragment `<>...</>` で囲む。
- すべてのタグを閉じる（`<br />`、`<img />`）。
- 属性は camelCase。`class` → `className`、`for` → `htmlFor`。
- JS 値の埋め込みは波括弧 `{}`。文字列リテラルはクォートのみでよい。

```jsx
function Profile({ user }) {
  return (
    <>
      <img className="avatar" src={user.imageUrl} alt={user.name} />
      <h1>{user.name}</h1>
    </>
  );
}
```

## props

- props は**読み取り専用**。子の中で書き換えない（[rules.md](rules.md) 参照）。
- 分割代入で受け取ると読みやすい: `function Avatar({ person, size })`。
- デフォルト値: `function Avatar({ size = 100 })`。
- まとめて渡す: `<Profile {...props} />`。
- 中身を渡すときは `children` を使う: `<Card><Avatar /></Card>`。

## 条件付きレンダリング

- `if` 文、三項演算子 `cond ? a : b`、論理 `cond && <X />` を使う。
- `&&` の左辺に**数値の 0** を置かない（`0` が画面に出る）。`count > 0 && ...` のように真偽値にする。
- 何も描画しないときは `null` を返す。

## リストのレンダリング

- 配列は `map()` で要素に変換する。フィルタは `filter()`。
- 各要素に**安定した一意の `key`** を付ける。
  - 配列の**インデックスを key にしない**（並び替え・挿入・削除で不具合）。
  - データ由来の ID（`item.id`）を使う。
  - `key` は React 内部用で、子コンポーネントからは props として読めない。必要なら別名で別途渡す。

```jsx
<ul>
  {products.map((product) => (
    <li key={product.id}>{product.title}</li>
  ))}
</ul>
```

## コンポーネントを純粋に保つ

- レンダー（コンポーネント関数の本体）は純粋関数として書く: 同じ入力なら同じ JSX、レンダー中に外部を変更しない。
- レンダー中に既存の変数・オブジェクト・props・state を書き換えない。レンダー中に作ったローカル変数の変更は問題ない。
- 副作用はイベントハンドラ（第一候補）か Effect に置く。詳細は [effects-and-refs.md](effects-and-refs.md)。
- `StrictMode` で二重レンダーしても壊れないことを確認する。

## UI をツリーとして捉える

- レンダーツリー（コンポーネントの親子関係）と、モジュール依存ツリー（import 関係）は別物。
- どこで何がレンダーされ、どこにデータが流れるかをツリーで意識すると、state の置き場所（リフトアップ）の判断がしやすい。
