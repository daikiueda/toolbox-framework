# Storybookカバレッジ調査結果

## 現状のカバレッジ

### ✅ ストーリー済み

- **Buttons**
  - Button (Button.stories.tsx)
  - FileTrigger (FileTrigger.stories.tsx)
- **Forms**
  - TextField (TextField.stories.ts)
- **Content**
  - Heading (Heading.stories.ts)
  - Text (Text.stories.tsx)
- **DropZone**
  - DropZone (DropZone.stories.tsx)
- **GlobalUI**
  - Toast (Toast.stories.tsx)

### ❌ ストーリー未作成

- **Buttons**
  - ActionButton
- **Forms**
  - Form
  - Radio, RadioGroup
  - Switch
- **Layout**
  - Flex
  - Content, Header, View
  - Page (カスタムコンポーネント)
  - Space (カスタムユーティリティ)
- **Content**
  - Well
- **Collections**
  - TableView関連 (Cell, Column, Row, TableBody, TableHeader, TableView)
  - TableViewUtil (カスタムユーティリティ)

## 優先順位

### 高優先度（よく使用される基本コンポーネント）

1. ActionButton
2. Switch
3. Form
4. Well
5. Flex

### 中優先度（レイアウト・データ表示）

1. TableView関連
2. Content, Header, View
3. Radio, RadioGroup

### 低優先度（特殊用途・ユーティリティ）

1. Page (カスタムコンポーネント)
2. Space (ユーティリティ)
3. TableViewUtil (ユーティリティ)

## 次のアクション

高優先度のコンポーネントから順次ストーリーを作成していく。
