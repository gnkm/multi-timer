# state の管理

出典: [state の管理](https://ja.react.dev/learn/managing-state)

state を「どこに・どう持つか」の設計判断。state を最小化する手順は [thinking-in-react.md](thinking-in-react.md) のステップ 3〜5 を先に参照する。

## UI を state の関数として宣言的に書く

- 「ボタンを無効化する」のような命令的な DOM 操作を書かない。
- 取りうる**視覚状態**（初期・入力中・送信中・成功・エラー）を列挙し、各状態の見た目を記述。state でどの状態かを表す。
- ユーザ操作で state を変え、React に再レンダーさせる。

## state 構造の原則

- **関連する state はまとめる**。常に一緒に変わる複数の値は 1 つのオブジェクト／state にする。
- **矛盾する state を避ける**。`isSending` と `isSent` のような排他フラグは、1 つの `status` 文字列にする。
- **冗長な state を避ける**。props や既存 state から計算できる値は state にせず、レンダー中に計算する。
- **重複を避ける**。同じデータを複数の state に持たない。選択中アイテムは「オブジェクトのコピー」ではなく「ID」を持つ。
- **深いネストを避ける**。正規化（フラット化）すると更新が簡単になる。

## イミュータブルな更新

state は直接書き換えない。新しい値を作って setter に渡す。

### オブジェクト

```jsx
// NG
person.firstName = 'Taro';
setPerson(person);

// OK: スプレッドで新しいオブジェクト
setPerson({ ...person, firstName: 'Taro' });
// ネストは各階層を展開
setPerson({ ...person, address: { ...person.address, city: 'Tokyo' } });
```

### 配列

ミューテートする操作（`push`/`pop`/`splice`/`sort`/`reverse` や要素への代入）を state に直接使わない。新しい配列を返す操作を使う。

| やりたいこと | 使う（新しい配列を返す） | 使わない（ミューテート） |
|---|---|---|
| 追加 | `[...arr, newItem]` | `push` |
| 削除 | `arr.filter(...)` | `splice` |
| 置換／更新 | `arr.map(...)` | `arr[i] = ...` |
| 並び替え | コピーしてから `slice().sort()` | `sort`/`reverse` |

## state はスナップショット

- 1 回のレンダー内で state の値は固定（スナップショット）。`setState` してもその場では変数は変わらない。
- 同じ値を連続更新するときは**更新関数**を使う。

```jsx
setCount(count + 1);
setCount(count + 1); // count は同じスナップショット → 実質 +1

setCount((c) => c + 1);
setCount((c) => c + 1); // 直前の結果に基づく → +2
```

## state の共有・スケール

UI 設計の文脈では [thinking-in-react.md](thinking-in-react.md) のステップ 4〜5 を起点に、規模に応じて次を選ぶ。

| 状況 | 手段 |
|---|---|
| 複数の子で同じ state が必要 | **リフトアップ**: 共通の親に state を置き props で配る |
| 更新ロジックが複雑／多数のイベント | **`useReducer`**: 更新を action に集約し、純粋な reducer で記述 |
| 深い階層へ props を渡し続ける（prop drilling） | **`useContext`**: Context で配布。頻繁に変わる値は再レンダーに注意 |
| 大きなツリーで複雑な state を共有 | **Reducer + Context** を組み合わせる |

```jsx
// Reducer の骨子
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added':   return [...tasks, { id: action.id, text: action.text }];
    case 'deleted': return tasks.filter((t) => t.id !== action.id);
    default: throw Error('Unknown action: ' + action.type);
  }
}
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

## state の保持とリセット

- React は UI ツリー上の**同じ位置・同じコンポーネント**なら state を保持する。位置が変わると state は破棄される。
- 同じ位置でも state を**リセット**したいときは、異なる `key` を渡す。

```jsx
// userId が変わるたびに Profile の state をリセット
<Profile key={userId} userId={userId} />
```
