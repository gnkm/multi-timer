# React App Template

TypeScript + React 向けの SPA テンプレートです。Vite 8、TanStack Router / Query、Biome、Vitest、lefthook を同梱しています。

## 前提

- Node.js `>=24.14.0`（[`.tool-versions`](./.tool-versions) 参照）
- [pnpm](https://pnpm.io/) `11.6.0`（[`packageManager`](./package.json) 参照）

`mise install` などで指定できます。

## セットアップ

```bash
pnpm install
pnpm run dev
```

## よく使うコマンド

| コマンド | 説明 |
|---------|------|
| `pnpm run dev` | 開発サーバー起動 |
| `pnpm run build` | 本番ビルド |
| `pnpm run test` | Vitest 実行 |
| `pnpm run lint` | Biome による lint / format チェック |
| `pnpm run lint:hooks` | ESLint（React Hooks / Compiler ルール） |
| `pnpm run ci` | typecheck + lint + test + build |

## ディレクトリ構成

```text
src/
├── app/           # Providers、レイアウト、ページコンポーネント
├── lib/           # ユーティリティ（cn など）
├── routes/        # TanStack Router ファイルベースルート
├── stores/        # Zustand ストア
├── styles/        # グローバル CSS（Tailwind CSS v4）
└── test/          # テスト setup、MSW、Router テスト用ヘルパー
```

## 採用スタック

| カテゴリ | ライブラリ |
|---------|-----------|
| UI | React 19、Tailwind CSS 4 |
| ルーティング | TanStack Router（ファイルベース） |
| データ取得 | TanStack Query |
| フォーム | React Hook Form + Zod |
| 状態管理 | Zustand |
| ビルド | Vite 8 + React Compiler |
| Lint / Format | Biome |
| React Compiler lint | ESLint (`eslint-plugin-react-hooks`) |
| テスト | Vitest + Testing Library + MSW + happy-dom |
| Git hooks | lefthook |

### Lint の役割分担

- **Biome**: フォーマット、import 整理、一般 lint、a11y
- **ESLint**: React Compiler 固有ルール（Biome 未対応のため最小構成で併用）

## TanStack Router

- ルート定義: `src/routes/`
- 生成ファイル: `src/routeTree.gen.ts`（dev / build 時に自動生成。Biome 対象外）

| パス | 内容 |
|------|------|
| `/` | デモ一覧（各ページへのリンク） |
| `/counter` | Zustand カウンターデモ |
| `/form` | React Hook Form + Zod デモ |

ページ本体は `src/app/pages/` に置き、`src/routes/` から読み込む構成です。新しいページを追加するときは両方にファイルを追加してください。

## lefthook

`pnpm install` 時に `prepare` スクリプトで lefthook がインストールされます。

### pre-commit

- Biome（ステージ済みファイル）
- ESLint hooks（`src/**/*.{ts,tsx}`）
- osv-scanner（`pnpm-lock.yaml` 変更時）
- gitleaks

### pre-push

- `pnpm run ci`（typecheck + lint + test + build）

### 外部ツール（pre-commit で必要）

以下はローカルにインストールしてください。未インストールの場合、該当 hook が失敗します。

```bash
# macOS (Homebrew)
brew install osv-scanner gitleaks
```

## CI

GitHub Actions（[`.github/workflows/ci.yml`](./.github/workflows/ci.yml)）で `pnpm run ci` を実行します。

PR 向けの脆弱性スキャンは [`.github/workflows/osv-scanner-pr.yml`](./.github/workflows/osv-scanner-pr.yml) で実行します。

## VS Code

[`.vscode/extensions.json`](./.vscode/extensions.json) の推奨拡張をインストールすると、Biome / ESLint / Tailwind / Vitest の開発体験が整います。
