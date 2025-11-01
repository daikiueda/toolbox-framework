# Repository Guidelines

## プロジェクト構成とモジュール配置

- `packages/__electron`: Electron 実行基盤。メイン/プリロード/レンダラのエントリと `electron-builder.yml` などビルド設定を提供します。
- `packages/__design-system`: GUIのデザインシステム。React Spectrum ベースの共通 UI と Storybook 環境。業務ワークスペースから再利用します。
- `packages/__cli`: CLI で利用する共通ユーティリティ。GUI と独立したコマンドライン機能の下支えとなります。
- `packages/__template`: 業務機能ワークスペースのスキャフォールド用テンプレート。実装例を含む複製元 (`__example` 的な位置付け) として扱い、ドメイン別ワークスペース (`packages/<feature-name>`) を追加するときにコピーして使います。
- `packages/gui-kitchen-sink`: デザインシステムのコンポーネントを“全部入り”で試せるワークスペース。Electron タブや単体 GUI を通して各種コンポーネントの動作確認に利用します。
- `packages/<feature-name>`: ドメインロジックや GUI/CLI を担う業務機能ワークスペース。元となる `__template` を複製し、機能固有の処理や GUI/CLI の実装を持たせて拡張します。
- `out/`: `npm run build` で生成される Electron/Vite の中間バンドルを格納します。`npm run start` や electron-builder の後続処理が参照するため、クリーンアップ有無を判断するときは注意してください。
- ルート直下には共通設定 (`electron.vite.config.ts`, `tsconfig*.json` など) がまとまっています。

## 新機能ワークスペースの追加

`packages/__template` を複製して新しい業務機能ワークスペース `packages/<feature-name>` を作成する手順です。

```bash
npm run create:workspace -- <feature-name>
```

このコマンドで以下の処理が自動実行されます：

- テンプレートの複製
- `package.json` の `name` と `bin` 調整
- GUI の初期表示名調整
- 依存関係インストールと CLI ビルド

### 使用例

```bash
# "my-feature" という機能ワークスペースを作成
npm run create:workspace -- my-feature

# 作成後の開発コマンド
npm run dev  # 統合確認
```

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

### Kitchen Sink

- `npm run --workspace packages/gui-kitchen-sink gui`: デザインシステムの Kitchen Sink を単体で起動し、ブラウザでコンポーネント挙動を確認します。

## コーディングスタイルと命名規約

- TypeScript/TSX は 2 スペースインデント、セミコロンあり、シングルクォートを基本とします（Prettier の既定ルールに従います）。
- React コンポーネントはパスカルケース、フックと util はキャメルケースで命名します。
- CLI エントリは `src/cli.ts`、ビルド成果は `bin/__cli.js` を既定とし、名称を変える場合は `package.json` の `bin` 定義と `build:cli` スクリプトを合わせて更新します。
- ESLint (`eslint.config.js` で `@electron-toolkit/eslint-config-ts` を拡張) と Prettier を必須の自動整形に使用し、コミット前に `npm run lint` / `npm run format` を走らせてください。
- テンプレートを複製した業務ワークスペースでも、個別の `.eslintrc` 等は原則追加せず、ルートの設定に従ってルールを共有します。特別な除外が必要な場合は `eslint.config.js` の `ignores` やルールを調整してください。
- ファイルは責務ごとに分割し、Electron のメイン／プリロード／レンダラで共有する型は `packages/__electron/src/preload/index.d.ts` に定義を集約しつつ、必要に応じて専用モジュールを追加してください。

## テストガイドライン

- テンプレート (`packages/__template`) では Node.js 組み込みの `node:test` を使用していますが、業務ワークスペースはユースケースに応じて Vitest や Storybook のスナップショットなど適切なフレームワークを採用して構いません。
- それぞれのワークスペースでテストを追加したら、`package.json` の `test` スクリプトに集約し、ルートの `npm run test:workspaces` で横断的に実行できる状態を維持してください。
- テンプレート準拠の場合、テストファイルは `src/__tests__` 配下で `.test.ts` サフィックスを付け、`esbuild-register` を通じて TypeScript を実行します。
- 重要なユーティリティや副作用を持つ hooks では、入力／出力の明示的な検証ケースを最低 1 つ用意し、スナップショットよりもアサーションを優先します。
- 失敗ケースを含むテストを揃え、CI では `--test-reporter=tap` などログが追いやすい形式で出力することを推奨します。

## コミットとプルリクエストの運用

- コミットメッセージは `<type>: <要約>` 形式（例: `fix: handle empty input`）を推奨します。タイプは `feat` / `fix` / `chore` / `style` など [Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/) をベースに選び、必要に応じて本文で背景や残課題を補足してください。
- AgentAI が生成した実装コードや変更をコミットする場合は、本文末尾に `Generated-by: Codex (model: gpt-5-codex)` のようなフッターを追加し、生成元が識別できるようにしてください。
- プルリクエストでは「目的」「主要な変更」「ローカルで確認したコマンド（例: `npm run lint`, `npm run test:workspaces`, 必要に応じて `npm run build`）」を箇条書きで共有します。
- 画面差分があればスクリーンショットやショート動画を添付し、依存追加や Electron 設定変更時は影響範囲とロールバック方法を一言添えてください。

## セキュリティと設定のヒント

- 認証トークンや外部 API キーは `.env.local` など未追跡ファイルに保持し、Vite の `import.meta.env` 経由で参照します。`.env` 系ファイルを共有する場合はサニタイズしてから渡してください。
- Electron の自動署名が必要な場合は `CSC_LINK` と `CSC_KEY_PASSWORD` をシェル環境で設定し、`build:mac` や `build:win` 実行時に読み込ませます。
- `packages/__electron/src/preload/index.ts` の `contextBridge` で公開する API は最小限にとどめ、レンダラへの新しいブリッジを追加するときは型定義 (`index.d.ts`) も同時に更新して安全性を保ちます。
