# React のルール

出典: [React のルール](https://ja.react.dev/reference/rules) / [フックのルール](https://ja.react.dev/reference/rules/rules-of-hooks)

これらは「守らないとバグになる」ルールであり、ガイドラインではない。実装・レビュー時に最初に確認する。`eslint-plugin-react-hooks` と `StrictMode` の併用を前提とする。

## 1. コンポーネントとフックを純粋に保つ

[詳細](https://ja.react.dev/reference/rules/components-and-hooks-must-be-pure)

- [ ] **冪等**: 同じ入力（props・state・context）に対し常に同じ JSX を返す。
- [ ] **副作用はレンダー外**: レンダー中に副作用（API 呼び出し、DOM 変更、購読、外部変数の書き換え）を起こさない。副作用はイベントハンドラか Effect に置く。
- [ ] **props / state はイミュータブル**: 直接書き換えない。更新は新しいオブジェクト／配列を作って setter に渡す。
- [ ] **フックの引数・返り値はイミュータブル**: フックに渡した値、フックが返した値を書き換えない。
- [ ] **JSX に渡した後の値はイミュータブル**: JSX で使った後に値を書き換えない。書き換えは JSX を作る前に済ませる。

```jsx
// NG: レンダー中の副作用・ミューテーション
function Profile({ user }) {
  user.visited = true;          // props のミューテーション
  document.title = user.name;   // レンダー中の副作用
  return <h1>{user.name}</h1>;
}

// OK
function Profile({ user }) {
  useEffect(() => {
    document.title = user.name; // 副作用は Effect で
  }, [user.name]);
  return <h1>{user.name}</h1>;
}
```

## 2. コンポーネントやフックを呼ぶのは React

[詳細](https://ja.react.dev/reference/rules/react-calls-components-and-hooks)

- [ ] **コンポーネントを通常関数として呼ばない**。JSX で使う（`<MyComponent />`）。`MyComponent()` と直接呼ばない。
- [ ] **フックを通常の値として取り回さない**。フックはコンポーネント／カスタムフック内で呼ぶだけ。引数で渡したり動的に組み立てたりしない。

```jsx
// NG
const result = MyComponent();      // 直接呼び出し
// OK
const result = <MyComponent />;    // JSX として使う
```

## 3. フックのルール

[詳細](https://ja.react.dev/reference/rules/rules-of-hooks)

- [ ] **トップレベルでのみ呼ぶ**: ループ・条件分岐・ネストした関数・`try`/`catch`/`finally` の中で呼ばない。early return より**前**に呼ぶ。
- [ ] **React 関数からのみ呼ぶ**: 関数コンポーネントか、`use` で始まるカスタムフックのトップレベルからのみ呼ぶ。通常の JS 関数・イベントハンドラ・クラスコンポーネントからは呼ばない。

```jsx
// NG: 条件の中でフック
function Bad({ cond }) {
  if (cond) {
    const theme = useContext(ThemeContext);
  }
}

// OK: トップレベルで呼び、値を条件で使う
function Good({ cond }) {
  const theme = useContext(ThemeContext);
  if (cond) { /* theme を使う */ }
}
```

## 強制ツール

- [ESLint プラグイン `eslint-plugin-react-hooks`](https://ja.react.dev/reference/eslint-plugin-react-hooks): フックのルール違反を検出する。
- [`StrictMode`](https://ja.react.dev/reference/react/StrictMode): 開発時にコンポーネントを 2 回レンダーし、純粋性違反（副作用・ミューテーション）を早期発見する。
