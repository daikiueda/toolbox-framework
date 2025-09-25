# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

### 基本的な開発

- `npm run dev`: Electron + Vite のホットリロード開発環境を起動
- `npm run start`: ビルド済みの成果物を実行して配布版の動作確認
- `npm run build`: TypeScript チェック後に Electron アプリケーションをビルド
- `npm run typecheck`: Node/Web 両方の TypeScript を検証（個別は `typecheck:node`, `typecheck:web`）

### コード品質チェック

- `npm run lint`: ESLint を実行してコードスタイルを修正
- `npm run lint:check`: ESLint でコードスタイルをチェック（修正せず警告0個まで）
- `npm run format`: Prettier でコード整形
- `npm run format:check`: Prettier でフォーマットチェック（修正せず）
- `npm run test:workspaces`: 全ワークスペースのテストを実行
- `npm run quality:check`: lint・format・typecheck・test を一括実行

### プラットフォーム別ビルド

- `npm run build:win`: Windows 向けビルド
- `npm run build:mac`: macOS 向けビルド
- `npm run build:linux`: Linux 向けビルド
- `npm run build:unpack`: 配布用ディレクトリを生成（パッケージング無し）

### ワークスペース単位の開発

- `npm run --workspace packages/<feature-name> gui`: 個別機能の GUI 開発サーバー起動
- `npm run --workspace packages/<feature-name> test`: 個別機能のテスト実行
- `npm run --workspace packages/<feature-name> build:cli`: CLI バンドル生成

## アーキテクチャ概要

### コア構成（packages/ 以下）

- `__electron/`: Electron 実行基盤（main/preload/renderer）と electron-builder 設定
- `__design-system/`: React Spectrum ベースの共通 UI コンポーネントと Storybook
- `__cli/`: CLI 共通ユーティリティ
- `__template/`: 新機能追加時のスキャフォールド用テンプレート
- `gui-kitchen-sink/`: デザインシステムのコンポーネントを一覧で試せる Kitchen Sink ワークスペース

### 新機能追加の手順

```bash
npm run create:workspace -- <feature-name>
```

自動的にテンプレート複製、設定調整、初期セットアップまで実行されます。

### Electron 構成

- Main プロセス: `packages/__electron/src/main/index.ts`
- Preload スクリプト: `packages/__electron/src/preload/index.ts`
- Renderer プロセス: `packages/__electron/src/renderer/`
- 型定義: `packages/__electron/src/preload/index.d.ts`

### ビルドツール

- **Electron**: electron-vite で main/preload/renderer を統合ビルド
- **Web**: Vite + React + TypeScript
- **CLI**: esbuild でバンドル生成
- **UI**: React Spectrum（Adobe の React UI ライブラリ）

## 技術スタック・設定

### TypeScript 設定

- `tsconfig.node.json`: Node.js 環境（main/preload）
- `tsconfig.web.json`: Web 環境（renderer）
- 厳密な型チェック有効、ES2022 ターゲット

### テスト環境

- Node.js 組み込み test runner + esbuild-register
- テストファイル: `src/__tests__/*.test.ts`
- ワークスペース横断実行: `npm run test:workspaces`

### パッケージ管理

- npm workspaces で複数パッケージを統合管理
- 依存関係は適切にワークスペース間で共有
- Node.js 22.15.1 固定（engines で指定）

### エディタ設定

- ESLint: `@electron-toolkit/eslint-config-ts` ベース
- Prettier: インポート文自動整理（@trivago/prettier-plugin-sort-imports）
- 推奨 VSCode 拡張: ESLint + Prettier

## 開発ワークフロー

### 新機能開発時の流れ

1. `npm run create:workspace -- <feature-name>` で新ワークスペース作成
2. `npm run --workspace packages/<feature-name> gui` で個別 GUI 開発
3. `npm run --workspace packages/<feature-name> test` で単体テスト
4. `npm run dev` で全体統合テスト
5. `npm run lint && npm run typecheck` でコード品質確認

### コミット前チェック項目

- `npm run lint`: ESLint ルール準拠
- `npm run format`: コード整形
- `npm run typecheck`: 型エラー無し
- `npm run test:workspaces`: 全テスト通過
