#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const TEMPLATE_DIR = './packages/__template';
const PACKAGES_DIR = './packages';

const getFeatureName = () => {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('❌ エラー: feature-name を指定してください');
    console.log('💡 使用例: npm run create:workspace -- my-feature');
    process.exit(1);
  }

  const featureName = args[0];

  // 基本的なバリデーション
  if (!/^[a-z0-9-]+$/.test(featureName)) {
    console.error('❌ エラー: feature-name は小文字英数字とハイフンのみ使用できます');
    process.exit(1);
  }

  return featureName;
};

const checkExistingDirectory = (featureName) => {
  const targetDir = path.join(PACKAGES_DIR, featureName);
  if (fs.existsSync(targetDir)) {
    console.error(`❌ エラー: ${targetDir} は既に存在します`);
    process.exit(1);
  }
};

const copyTemplate = (featureName) => {
  const targetDir = path.join(PACKAGES_DIR, featureName);
  console.log(`📂 テンプレートを複製中: ${TEMPLATE_DIR} → ${targetDir}`);

  try {
    fs.cpSync(TEMPLATE_DIR, targetDir, { recursive: true });
    console.log('✅ テンプレート複製完了');
  } catch (error) {
    console.error('❌ テンプレート複製失敗:', error.message);
    process.exit(1);
  }
};

const updatePackageJson = (featureName) => {
  const packageJsonPath = path.join(PACKAGES_DIR, featureName, 'package.json');
  console.log('📝 package.json を調整中...');

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // name と bin を更新
    packageJson.name = `@toolbox/${featureName}`;
    packageJson.bin = {
      [`toolbox-${featureName}`]: './bin/cli.js',
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log('✅ package.json 調整完了');
  } catch (error) {
    console.error('❌ package.json 調整失敗:', error.message);
    process.exit(1);
  }
};

const updateAppTsx = (featureName) => {
  const appTsxPath = path.join(PACKAGES_DIR, featureName, 'gui', 'App.tsx');
  console.log('📝 App.tsx を調整中...');

  try {
    let content = fs.readFileSync(appTsxPath, 'utf8');

    // Heading のテキストを更新
    const capitalizedName = featureName.charAt(0).toUpperCase() + featureName.slice(1);
    content = content.replace(
      '<Heading level={1}>Example</Heading>',
      `<Heading level={1}>${capitalizedName}</Heading>`
    );

    fs.writeFileSync(appTsxPath, content);
    console.log('✅ App.tsx 調整完了');
  } catch (error) {
    console.error('❌ App.tsx 調整失敗:', error.message);
    process.exit(1);
  }
};

const runInitialSetup = (featureName) => {
  console.log('🔧 初期セットアップを実行中...');

  try {
    // npm install を実行
    console.log('📦 npm install 実行中...');
    execSync('npm install', { stdio: 'inherit', cwd: process.cwd() });

    // build:cli を実行
    console.log('🏗️  CLI ビルド実行中...');
    execSync(`npm run --workspace packages/${featureName} build:cli`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    console.log('✅ 初期セットアップ完了');
  } catch (error) {
    console.error('❌ 初期セットアップ失敗:', error.message);
    process.exit(1);
  }
};

const main = () => {
  console.log('🚀 新機能ワークスペースを作成中...\n');

  const featureName = getFeatureName();
  console.log(`📋 機能名: ${featureName}\n`);

  checkExistingDirectory(featureName);
  copyTemplate(featureName);
  updatePackageJson(featureName);
  updateAppTsx(featureName);
  runInitialSetup(featureName);

  console.log('\n🎉 新機能ワークスペースの作成が完了しました！');
  console.log('\n💡 次のステップ:');
  console.log(`   GUI開発: npm run --workspace packages/${featureName} gui`);
  console.log(`   テスト:   npm run --workspace packages/${featureName} test`);
  console.log(`   統合確認: npm run dev`);
};

main();
