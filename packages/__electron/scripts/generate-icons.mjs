#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { access, copyFile, mkdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceDir = path.resolve(__dirname, '..');
const resourcesDir = path.join(workspaceDir, 'resources');
const buildDir = path.join(workspaceDir, 'build');

const candidateSources = (() => {
  const [, , cliArgument] = process.argv;
  const result = [];

  if (cliArgument) {
    result.push(path.resolve(process.cwd(), cliArgument));
  }

  result.push(path.join(resourcesDir, 'app-icon.png'));
  result.push(path.join(resourcesDir, 'icon.png'));

  return result;
})();

const resolveExistingPng = async () => {
  for (const candidate of candidateSources) {
    try {
      await access(candidate);
      const stats = await stat(candidate);
      if (stats.isFile() && path.extname(candidate).toLowerCase() === '.png') {
        return candidate;
      }
    } catch {
      // ignore missing candidates
    }
  }

  throw new Error(
    'PNG アイコンが見つかりません。resources/app-icon.png または resources/icon.png を用意してください。'
  );
};

const resolveAppBuilderBinary = async () => {
  const require = createRequire(import.meta.url);
  const pkgPath = require.resolve('app-builder-bin/package.json', { paths: [workspaceDir] });
  const rootDir = path.dirname(pkgPath);
  const { platform, arch } = process;

  const ensureBinary = async (filePath) => {
    await access(filePath);
    return filePath;
  };

  if (platform === 'darwin') {
    const binaryName = arch === 'arm64' ? 'app-builder_arm64' : 'app-builder_amd64';
    return ensureBinary(path.join(rootDir, 'mac', binaryName));
  }

  if (platform === 'win32') {
    const mapping = {
      arm64: 'arm64',
      ia32: 'ia32',
      x64: 'x64',
    };
    const folder = mapping[arch] ?? 'x64';
    return ensureBinary(path.join(rootDir, 'win', folder, 'app-builder.exe'));
  }

  const mapping = {
    arm: 'arm',
    arm64: 'arm64',
    ia32: 'ia32',
    loong64: 'loong64',
    riscv64: 'riscv64',
    x64: 'x64',
  };
  const folder = mapping[arch] ?? 'x64';
  return ensureBinary(path.join(rootDir, 'linux', folder, 'app-builder'));
};

const runAppBuilder = async (binary, format, inputFile) => {
  const input = path.resolve(inputFile);
  const output = path.resolve(buildDir);
  const args = ['icon', '--input', input, '--format', format, '--out', output];

  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { stdio: ['ignore', 'pipe', 'inherit'] });
    let stdout = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`app-builder exited with code ${code}`));
        return;
      }

      if (!stdout.trim()) {
        resolve([]);
        return;
      }

      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed.icons ?? []);
      } catch (error) {
        reject(new Error(`アイコン生成結果のパースに失敗しました: ${error.message}`));
      }
    });
  });
};

const validateSquarePng = async (sourcePath, label, minimumSize) => {
  const metadata = await sharp(sourcePath).metadata();
  const { width, height } = metadata;

  if (!width || !height) {
    throw new Error(`${label} のサイズ情報を取得できませんでした。`);
  }

  if (width !== height) {
    throw new Error(`${label} は正方形の PNG が必要です (検出サイズ: ${width}x${height}).`);
  }

  if (width < minimumSize) {
    throw new Error(`${label} は一辺 ${minimumSize}px 以上の PNG を使用してください。`);
  }

  return width;
};

const ensureLinuxIcon = async (sourcePath) => {
  const linuxIconSize = 512;
  const size = await validateSquarePng(sourcePath, 'icon.png', linuxIconSize);
  const buildIconPath = path.join(buildDir, 'icon.png');

  if (size === linuxIconSize) {
    await copyFile(sourcePath, buildIconPath);
    return 'build/icon.png を 512px のままコピーしました。\n';
  }

  await sharp(sourcePath)
    .resize(linuxIconSize, linuxIconSize, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(buildIconPath);

  return `build/icon.png を ${size}px から 512px にリサイズしました。\n`;
};

const resolveMacIconSource = async (fallbackPath) => {
  const macIconCandidate = path.join(resourcesDir, 'icon-with-backdrop.png');

  try {
    await access(macIconCandidate);
    const size = await validateSquarePng(macIconCandidate, 'icon-with-backdrop.png', 512);
    return {
      path: macIconCandidate,
      message: `ICNS 生成に icon-with-backdrop.png (${size}px) を使用します。\n`,
    };
  } catch {
    const size = await validateSquarePng(fallbackPath, 'icon.png', 512);
    return {
      path: fallbackPath,
      message: `icon-with-backdrop.png が見つからないため icon.png (${size}px) を使用します。\n`,
    };
  }
};

const main = async () => {
  const sourcePng = await resolveExistingPng();
  const appBuilderBinary = await resolveAppBuilderBinary();

  await mkdir(buildDir, { recursive: true });

  const resourceIconPath = path.join(resourcesDir, 'icon.png');
  if (path.resolve(sourcePng) !== path.resolve(resourceIconPath)) {
    await copyFile(sourcePng, resourceIconPath);
  }

  const linuxMessage = await ensureLinuxIcon(resourceIconPath);
  process.stdout.write(linuxMessage);

  const { path: macIconSource, message: macMessage } = await resolveMacIconSource(resourceIconPath);
  process.stdout.write(macMessage);

  const formats = [
    { format: 'icns', input: macIconSource },
    { format: 'ico', input: resourceIconPath },
  ];

  for (const { format, input } of formats) {
    process.stdout.write(`Generating ${format.toUpperCase()} icon...\n`);
    const results = await runAppBuilder(appBuilderBinary, format, input);
    if (results.length === 0) {
      process.stdout.write(`  No ${format.toUpperCase()} artifacts reported.\n`);
    } else {
      results.forEach((result) => {
        process.stdout.write(
          `  -> ${path.relative(workspaceDir, result.file)} (${result.size}px)\n`
        );
      });
    }
  }

  process.stdout.write('アイコン更新が完了しました。\n');
};

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
