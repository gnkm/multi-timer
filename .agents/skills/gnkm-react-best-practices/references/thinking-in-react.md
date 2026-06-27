# React の流儀（設計ワークフロー）

出典: [React の流儀](https://ja.react.dev/learn/thinking-in-react)

新規 UI を実装するときの設計手順。要件やモックアップから動く React コンポーネントへ落とす 5 ステップを、この順序で進める。

## ステップ 1: UI をコンポーネント階層に分割する

- モックアップ／要件の各要素を四角で囲み、名前を付ける。
- **1 コンポーネントは 1 つのことだけを担う**（関心の分離）。大きくなったら小さく分割する。
- データモデル（JSON など）の形は UI の構造に対応することが多い。データの 1 単位に 1 コンポーネントを対応させる。
- 特定したコンポーネントを入れ子関係で階層に整理する。

例: 検索可能な商品テーブル

```
FilterableProductTable
├── SearchBar
└── ProductTable
    ├── ProductCategoryRow
    └── ProductRow
```

## ステップ 2: 静的バージョンを先に作る

- **state を一切使わず**、props だけでデータモデルをレンダーするバージョンを作る。
- データは上位から下位へ props で流す（単方向データフロー）。
- 小規模ならトップダウン、大規模ならボトムアップで組むと進めやすい。
- この段階でインタラクティブ性（イベント・state）は実装しない。

理由: 静的バージョンは「考えることは少なくタイプ量が多い」作業、インタラクティブ化は「タイプ量は少なく考えることが多い」作業。分けると both が楽になる。

## ステップ 3: 最小かつ完全な UI state を見つける

state は「アプリが記憶すべき、変化するデータの最小セット」。DRY を守り、**他から計算できるものは state にしない**。

各データ候補を次の 3 問で判定する。1 つでも「はい」なら state ではない。

1. 時間が経っても**変わらない**か？ → state ではない（定数）
2. 親から **props で渡される**か？ → state ではない
3. コンポーネント内の既存の state / props から**計算できる**か？ → state ではない（レンダー中に計算する）

残ったものが state。

例（商品テーブル）: 元の商品リスト = props、フィルタ済みリスト = 計算可能 → state ではない。検索文字列とチェックボックス値だけが state。

## ステップ 4: state を保持する場所を特定する

各 state について:

1. その state を使って表示する**すべて**のコンポーネントを挙げる。
2. それら全員の**最も近い共通の親**を見つける。
3. state の置き場所を決める:
   - 多くはその共通の親に置ける。
   - 適切な所有者がなければ、state を持つためのコンポーネントを共通の親より上に新設する。

これが**リフトアップ（state のリフトアップ）**。state を持つコンポーネントで `useState` を呼び、子へ props で配る。

```jsx
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  // filterText / inStockOnly を SearchBar と ProductTable に props で渡す
}
```

## ステップ 5: 逆方向データフローを追加する

下位のフォームが上位の state を更新できるようにする。React では双方向バインディングを使わず、**明示的に**コールバックを渡す。

- 親は state の setter をコールバック（`onFilterTextChange` など）として子に渡す。
- 子は入力イベントでそのコールバックを呼ぶ。
- 入力は**制御コンポーネント**にする（`value` と `onChange` をペアで指定）。`value` だけ指定して `onChange` がないと読み取り専用になりコンソール警告が出る。

```jsx
function SearchBar({ filterText, onFilterTextChange }) {
  return (
    <input
      value={filterText}
      onChange={(e) => onFilterTextChange(e.target.value)}
    />
  );
}
```

## 補足: props と state の違い

- **props**: 関数の引数のようなもの。親から子へ渡し、見た目をカスタマイズする。子は受け取った props を書き換えない（読み取り専用）。
- **state**: コンポーネントのメモリ。コンポーネント自身が保持し、ユーザ操作に反応して変更する。

親は state として情報を持ち、それを子へ props として渡す。データは常に上から下へ流れる（単方向データフロー）。

## 関連する詳細リファレンス

- state の構造・更新・共有の詳細 → `references/state.md`
- コンポーネント分割・JSX・props の詳細 → `references/components-and-jsx.md`
- 守るべきルール → `references/rules.md`
