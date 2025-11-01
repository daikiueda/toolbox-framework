#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const TEMPLATE_DIR = './packages/__template';
const PACKAGES_DIR = './packages';

const toPascalCase = (featureName) =>
  featureName
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

const toCamelCase = (featureName) => {
  const pascal = toPascalCase(featureName);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const toScreamingSnakeCase = (featureName) => featureName.replace(/-/g, '_').toUpperCase();

const toTitleCase = (featureName) =>
  featureName
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const collectFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(entryPath);
    }
    if (entry.isFile()) {
      return [entryPath];
    }
    return [];
  });
};

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

const replaceTemplateIdentifiers = (featureName) => {
  console.log('🛠️ テンプレート識別子を置換中...');

  const targetDir = path.join(PACKAGES_DIR, featureName);
  const pascalName = toPascalCase(featureName);
  const camelName = toCamelCase(featureName);
  const screamingSnakeName = toScreamingSnakeCase(featureName);
  const titleCaseName = toTitleCase(featureName);

  const replacements = [
    { search: /@toolbox\/template/g, replace: `@toolbox/${featureName}` },
    {
      search: /(['"])template\1/g,
      replace: (_, quote) => `${quote}${featureName}${quote}`,
    },
    {
      search: /template:/g,
      replace: `${featureName}:`,
    },
    {
      search: /(['"])Template\1/g,
      replace: (_, quote) => `${quote}${titleCaseName}${quote}`,
    },
    { search: 'TEMPLATE', replace: screamingSnakeName },
    { search: 'Template', replace: pascalName },
    { search: 'template', replace: camelName },
  ];

  try {
    const files = collectFiles(targetDir);

    files.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      const updated = replacements.reduce((acc, { search, replace }) => {
        if (search instanceof RegExp) {
          return acc.replace(search, replace);
        }
        return acc.split(search).join(replace);
      }, content);

      if (updated !== content) {
        fs.writeFileSync(filePath, updated);
      }
    });

    console.log('✅ テンプレート識別子の置換完了');
  } catch (error) {
    console.error('❌ テンプレート識別子の置換失敗:', error.message);
    process.exit(1);
  }
};

const runInitialSetup = () => {
  console.log('🔧 初期セットアップを実行中...');

  try {
    // npm install を実行
    console.log('📦 npm install 実行中...');
    execSync('npm install --no-optional', { stdio: 'inherit', cwd: process.cwd() });

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
  replaceTemplateIdentifiers(featureName);
  runInitialSetup();

  console.log('\n🎉 新機能ワークスペースの作成が完了しました！');
  console.log('\n💡 次のステップ:');
  console.log(`   GUI開発: npm run --workspace packages/${featureName} gui`);
  console.log(`   テスト:   npm run --workspace packages/${featureName} test`);
  console.log(`   統合確認: npm run dev`);
};

main();
