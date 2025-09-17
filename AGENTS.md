# Repository Guidelines

## プロジェクト構成とモジュール配置

- `packages/__electron`: Electron メインプロセスのエントリ、`electron-builder.yml`、リリース用リソースを保持します。
- `packages/__template`: React + TypeScript のレンダラと preload、`gui/` と `src/` に UI とビジネスロジックをまとめています。
- `packages/__design-system`: 共通 UI コンポーネント、`Components/` と `GlobalUI/` に整理されたスタイル定義を提供します。
- `packages/__cli`: CLI エントリーポイント。GUI と連携する補助スクリプトを配置します。
- 生成物は `out/` に出力されます。設定ファイルはプロジェクト直下 (`electron.vite.config.ts`, `tsconfig*.json`) に集約されています。

## ビルド・テスト・開発コマンド

- `npm install`: ルートとワークスペースの依存関係を全て揃えます。
- `npm run dev`: Electron + Vite のホットリロード環境を起動し、メイン／レンダラ両方を監視します。
- `npm run start`: ビルド済み成果物をプレビューし、配布イメージの挙動を検証します。
- `npm run build`: Node/Web の型チェック実行後、配布用のバンドルを生成します。
- `npm run lint` / `npm run format`: ESLint と Prettier を適用してスタイル逸脱を防ぎます。
- `npm exec node --test packages/__template/src/__tests__`: Node.js テストランナーでユニットテストをローカル実行します。

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

- コミットメッセージは「Fix build step」のように 50 文字以内の命令形サマリを推奨します。関連するパッケージ名があれば `[cli]` のような接頭語で示します。
- PR では目的、主要な変更点、テスト結果 (`npm run build` など) を箇条書きで記載し、該当課題があればリンクを付けてください。
- UI 変更時は `out/` のプレビューキャプチャや短い動画でビュー差分を共有するとレビューが円滑です。
- 依存追加や Electron 設定変更を伴う場合、影響範囲とロールバック手順を記述し、レビューアが安全に検証できるようにします。

## セキュリティと設定のヒント

- 認証トークンや外部 API キーは `.env.local` など未追跡ファイルに保持し、Vite の `import.meta.env` 経由で参照します。`.env` 系ファイルは共有前に内容をサニタイズしてください。
- Electron の自動署名が必要な場合は `CSC_LINK` と `CSC_KEY_PASSWORD` をシェル環境で設定し、`build:mac` や `build:win` 実行時に読み込ませます。
- `packages/__electron/src/preload/index.ts` の `contextBridge` で公開する API は最小限にとどめ、レンダラへの新しいブリッジを追加するときは型定義 (`index.d.ts`) も同時に更新して安全性を保ちます。
