# Effect と ref（避難ハッチ）

出典: [避難ハッチ](https://ja.react.dev/learn/escape-hatches) / [そのエフェクトは不要かも](https://ja.react.dev/learn/you-might-not-need-an-effect)

Effect と ref は React のパラダイムからの**避難ハッチ**。外部システムと関わる時だけ使い、アプリのロジックの大半はこれらに依存させない。

## まず「Effect が不要か」を判断する

Effect を書く前に次を確認する。多くの Effect は不要。

- **レンダー用のデータ変換に Effect は不要**。フィルタ・整形・結合などは**レンダー中に計算**する。`firstName + lastName` のような派生値を state + Effect で持たない。
- **ユーザイベントの処理に Effect は不要**。クリックや送信で起きることは**イベントハンドラ**に書く。
- 判断基準: そのコードが走る**理由**を問う。
  - ユーザ操作が理由 → **イベントハンドラ**
  - コンポーネントが画面に表示されたことが理由 → **Effect**

不要 Effect の典型と置き換え:

| アンチパターン | 正しい方法 |
|---|---|
| props/state から派生 state を Effect で更新 | レンダー中に計算 |
| 重い計算を Effect + state でキャッシュ | `useMemo`（Compiler 有効なら不要なことが多い） |
| prop 変更時に state リセット | `key` を渡してリセット |
| イベント時の POST/通知を Effect で | イベントハンドラに移動 |
| state 更新の数珠つなぎ（Effect の連鎖） | イベントハンドラで次の state を計算 |
| 外部ストアの購読を Effect で | [`useSyncExternalStore`](https://ja.react.dev/reference/react/useSyncExternalStore) |
| 親への通知を Effect で | イベントハンドラで親と自分を同時更新 |

## Effect を正しく使う場合

外部システムとの**同期**: ネットワーク接続、購読、ブラウザ API、サードパーティウィジェット、（フレームワーク未使用時の）データ取得など。

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect(); // クリーンアップで後始末
}, [roomId]); // 依存配列: 使っているリアクティブな値をすべて入れる
```

- **クリーンアップを返す**。接続・購読・タイマーは必ず後始末する（`StrictMode` の二重実行でも正しく動くように）。
- **依存配列**はリンタに従い、Effect 内で使うリアクティブな値（props・state・それらから作る関数/値）をすべて含める。
- 依存を**減らしたい**ときは、値を Effect の外や中へ動かす、関数をコンポーネント外へ出す、オブジェクト/関数依存を避ける。依存配列に嘘をつかない。

## イベントと Effect の分離: useEffectEvent

Effect 内で「最新の値は読みたいが、それが変わっても Effect を再実行したくない」場合に [`useEffectEvent`](https://ja.react.dev/reference/react/useEffectEvent)（React 19.2 で安定）を使う。

```jsx
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('接続しました', theme); // 最新の theme を読む
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => onConnected());
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // theme は依存に入れない → theme 変更で再接続しない
}
```

- Effect Event は依存配列に**入れない**（リンタが警告する）。
- 呼び出せるのは Effect の中だけ。レンダー中やイベントハンドラからは呼ばない。

## ref で値を参照する

- 再レンダーを**起こさず**値を保持したいときは [`useRef`](https://ja.react.dev/reference/react/useRef)。`ref.current` で読み書きする。
- レンダー結果に影響する値は state、影響しない値（タイマー ID、直前の値、DOM 参照など）は ref。
- **レンダー中に `ref.current` を読み書きしない**（純粋性が壊れる）。イベントハンドラや Effect で扱う。

## ref で DOM を操作する

```jsx
function Form() {
  const inputRef = useRef(null);
  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>フォーカス</button>
    </>
  );
}
```

- React 19 では `ref` を通常の props として子コンポーネントに渡せる（`forwardRef` は不要）。
- React が管理する DOM を手動で変更・削除しない。フォーカス・スクロール・選択範囲・サイズ測定などの用途に留める。

## カスタムフックでロジックを共有する

- 名前は `use` で始める。複数コンポーネントで共有したいステートフルなロジックを抽出する。
- カスタムフックは**ロジック**を共有するもので、state そのものは共有しない（使うたびに独立した state を持つ）。

```jsx
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);
}
```
