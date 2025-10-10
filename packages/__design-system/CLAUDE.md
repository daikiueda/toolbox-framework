# Design System (\_\_design-system)

このパッケージは、Adobe React Spectrum をベースにした共通 UI コンポーネントライブラリです。

## アーキテクチャ

### 基本方針

- **React Spectrum の再エクスポート**: Adobe の React Spectrum コンポーネントをラップして提供
- **一貫性**: プロジェクト全体で統一された UI/UX を提供
- **Storybook**: 各コンポーネントの動作確認とドキュメント生成

## ディレクトリ構造

```
packages/__design-system/
├── Components/
│   ├── Forms/          # フォーム関連コンポーネント
│   ├── Buttons/        # ボタン関連
│   ├── Content/        # コンテンツ表示
│   ├── Collections/    # リストやテーブル
│   ├── Dialog/         # ダイアログ・モーダル
│   ├── DropZone/       # ファイルドロップゾーン
│   └── Layout/         # レイアウト
├── hooks/              # カスタムフック
├── GlobalUI/           # グローバル UI（Toast など）
├── AppRoot/            # アプリケーションルート
└── utils/              # ユーティリティ
```

## コンポーネント追加の手順

### 1. React Spectrum コンポーネントの再エクスポート

`Components/<Category>/index.ts` で React Spectrum のコンポーネントをエクスポート：

```typescript
// 例: Components/Forms/index.ts
export { TextField, TextArea } from '@react-spectrum/textfield';
export { NumberField } from '@react-spectrum/numberfield';
export { Switch } from '@react-spectrum/switch';
```

### 2. Storybook ストーリーの作成

`Components/<Category>/<ComponentName>.stories.tsx` を作成。

**推奨パターン（Switch.stories.tsx ベース）**:

```typescript
import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Switch } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/Switch.html
 */
const meta: Meta<typeof Switch> = {
  title: 'Components/Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    isEmphasized: { control: 'boolean' },
    isSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Enable notifications',
    onChange: fn(),
    isEmphasized: false,
    isSelected: false,
    isDisabled: false,
    isReadOnly: false,
  },
};
export default meta;

export const Quiet: StoryObj<typeof Switch> = {
  argTypes: {
    isEmphasized: { control: false },
  },
  args: {
    isSelected: true,
  },
};

export const Emphasized: StoryObj<typeof Switch> = {
  argTypes: {
    isEmphasized: { control: false },
  },
  args: {
    isEmphasized: true,
    isSelected: true,
  },
};

export const Disabled: StoryObj<typeof Switch> = {
  argTypes: {
    isDisabled: { control: false },
  },
  args: {
    isDisabled: true,
  },
};
```

### Storybook パターンの重要ポイント

1. **`fn()` でイベントハンドラをモック**
   - `storybook/test` から `fn()` をインポート
   - `args: { onChange: fn() }` でアクション記録

2. **個別ストーリーで Control を無効化**
   - 特定の状態を固定したいストーリーでは `argTypes: { propName: { control: false } }`
   - そのストーリーが表現したい状態に集中させる

3. **Quiet / Emphasized スタイルの扱い**

   React Spectrum のコンポーネントには、スタイルに応じて異なる props パターンがある：
   - **`isQuiet` を持つコンポーネント**（フォーム入力系）
     - TextField, NumberField など
     - デフォルト = 通常スタイル、`isQuiet={true}` = 控えめな見た目
     - Basic ストーリーはデフォルトのまま

   - **`isEmphasized` を持つコンポーネント**（選択/トグル系）
     - Switch, RadioGroup など
     - デフォルト = Quiet スタイル、`isEmphasized={true}` = 強調
     - Basic ストーリーには `name: 'Basic (Quiet)'` として、デフォルトが Quiet であることを明示

   - **独自のスタイルシステム**
     - Button など（`variant` と `style` props を使用）

## Storybook の起動

```bash
npm run storybook
```

## 参考リンク

- [React Spectrum Documentation](https://react-spectrum.adobe.com/react-spectrum/)
- [Storybook Documentation](https://storybook.js.org/)
