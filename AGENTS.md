# Repository Guidelines

## プロジェクト構成とモジュール配置

- `packages/__electron`: Electron 実行基盤。メイン/プリロード/レンダラのエントリと `electron-builder.yml` などビルド設定を提供します。
- `packages/__design-system`: React Spectrum ベースの共通 UI と Storybook 環境。業務ワークスペースから再利用します。
- `packages/__cli`: CLI で利用する共通ユーティリティ。GUI と独立したコマンドライン機能の下支えとなります。
- `packages/__template`: 業務機能ワークスペースのスキャフォールド用テンプレート。実装例を含む複製元 (`__example` 的な位置付け) として扱い、ドメイン別ワークスペース (`packages/<feature-name>`) を追加するときにコピーして使います。
- `packages/<feature-name>`: ドメインロジックや GUI/CLI を担う業務機能ワークスペース。元となる `__template` を複製し、機能固有の処理や GUI/CLI の実装を持たせて拡張します。
- `out/`: `npm run build` で生成される Electron/Vite の中間バンドルを格納します。`npm run start` や electron-builder の後続処理が参照するため、クリーンアップ有無を判断するときは注意してください。
- ルート直下には共通設定 (`electron.vite.config.ts`, `tsconfig*.json` など) がまとまっています。

## ビルド・テスト・開発コマンド

### ルート共通

- `npm install`: ルートと各ワークスペースの依存関係をまとめて解決します。初回セットアップ後に `postinstall` で Electron 依存も調整されます。
- `npm run dev`: Electron + Vite のホットリロード環境を起動し、メイン／プリロード／レンダラの変更を逐次反映します。
- `npm run start`: `out/` に生成済みの成果物を起動し、配布想定の挙動を確認します。
- `npm run typecheck`: Node/Web の TypeScript プロジェクトをそれぞれ `--noEmit` で検証します。個別に確認したい場合は `typecheck:node` / `typecheck:web` を利用します。
- `npm run test:workspaces`: すべてのワークスペースで `test` スクリプトを実行します。`--workspaces --if-present` により、テストスクリプトが定義されている業務ワークスペースだけを走査します。
- `npm run lint` / `npm run format`: ESLint と Prettier を一括適用します。コミット前に走らせて差分のスタイル逸脱を防ぎます。
- `npm run build`: 事前に `typecheck` を行った上で Electron レンダラ／メインをビルドし、配布用アーティファクトを生成します。
- `npm run build:unpack` / `npm run build:win` / `npm run build:mac` / `npm run build:linux`: `packages/__electron/electron-builder.yml` を参照してターゲット別の配布物やディレクトリ構成を出力します。

### 業務ワークスペース (`packages/<feature-name>`) で使う例

- `npm run --workspace packages/<feature-name> gui`: Vite を起動し、業務ワークスペース固有の GUI 開発サーバーを立ち上げます（`__template` 由来の `gui` スクリプト）。
- `npm run --workspace packages/<feature-name> test`: Node.js テストランナーを `esbuild-register` 経由で実行し、`src/__tests__` 以下の `.test.ts` を検証します。
- `npm run --workspace packages/<feature-name> build:cli`: `esbuild` で CLI エントリをバンドルし、`bin/__cli.js` を生成します。複製直後の `postinstall` ではこのスクリプトが自動実行されます。

## コーディングスタイルと命名規約

- TypeScript/TSX は 2 スペースインデント、セミコロン無し、シングルクォートを基本とします。
- React コンポーネントはパスカルケース、フックと util はキャメルケースで命名します。
- ESLint (`@electron-toolkit/eslint-config-ts`) と Prettier を必須の自動整形に使用し、コミット前に `lint` と `format` を走らせてください。
- ファイルは責務ごとに分割し、Electron のメイン／プリロード／レンダラで共有する型は `packages/__electron/src/preload/index.d.ts` に定義を集約しつつ、必要に応じて専用モジュールを追加してください。

## テストガイドライン

- Node.js 組み込みの `node:test` を採用しています。テストファイルは `__tests__` ディレクトリ内で `.test.ts` サフィックスを付けてください。
- 重要なユーティリティや副作用を持つ hooks には例示的な入力／出力ケースを最低 1 つ用意し、スナップショットよりもアサーションを優先します。
- 新規機能では失敗ケースも `describe` ブロックに含め、`--test-reporter=tap` で CI 連携しやすい出力を確保してください。

## コミットとプルリクエストの運用

- コミットメッセージは `<type>: <要約>` 形式 (例: `fix: resolve preload crash on mac`) を推奨します。タイプは `feat` / `fix` / `chore` / `style` など Conventional Commits をベースに選択してください。
- 本文がある場合は空行を挟み、最新方針に倣って「更新内容:」「未対応事項:」の見出しと箇条書きで背景やリスクを明記するとレビューがスムーズです。
- PR では目的、主要な変更点、テスト結果 (`npm run build` など) を箇条書きで記載し、該当課題があればリンクを付けてください。
- UI 変更時は `out/` のプレビューキャプチャや短い動画でビュー差分を共有するとレビューが円滑です。
- 依存追加や Electron 設定変更を伴う場合、影響範囲とロールバック手順を記述し、レビューアが安全に検証できるようにします。

## セキュリティと設定のヒント

- 認証トークンや外部 API キーは `.env.local` など未追跡ファイルに保持し、Vite の `import.meta.env` 経由で参照します。`.env` 系ファイルは共有前に内容をサニタイズしてください。
- Electron の自動署名が必要な場合は `CSC_LINK` と `CSC_KEY_PASSWORD` をシェル環境で設定し、`build:mac` や `build:win` 実行時に読み込ませます。
- `packages/__electron/src/preload/index.ts` の `contextBridge` で公開する API は最小限にとどめ、レンダラへの新しいブリッジを追加するときは型定義 (`index.d.ts`) も同時に更新して安全性を保ちます。
