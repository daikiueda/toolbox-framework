import * as fs from 'fs/promises';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { tmpdir } from 'os';
import * as path from 'path';

import { basename, readFile, writeFile } from '../index';

describe('@toolbox/cli', () => {
  describe('basename', () => {
    it('ファイルパスからベースネームを抽出する', () => {
      assert.strictEqual(basename('/path/to/file.txt'), 'file.txt');
      assert.strictEqual(basename('file.txt'), 'file.txt');
      assert.strictEqual(basename('/path/to/directory/'), 'directory');
    });

    it('空の文字列を渡すと空の文字列を返す', () => {
      assert.strictEqual(basename(''), '');
    });
  });

  describe('readFile', () => {
    it('ファイルの内容を読み取る', async () => {
      const tempDir = tmpdir();
      const testFile = path.join(tempDir, 'test-read.txt');
      const content = 'Hello, World!';

      await fs.writeFile(testFile, content);

      const result = await readFile(testFile);
      assert.strictEqual(result, content);

      await fs.unlink(testFile);
    });

    it('存在しないファイルを読み取ろうとするとエラーが発生する', async () => {
      const nonExistentFile = path.join(tmpdir(), 'non-existent.txt');

      await assert.rejects(
        () => readFile(nonExistentFile),
        (err: NodeJS.ErrnoException) => err.code === 'ENOENT'
      );
    });
  });

  describe('writeFile', () => {
    it('ファイルに内容を書き込む', async () => {
      const tempDir = tmpdir();
      const testFile = path.join(tempDir, 'test-write.txt');
      const content = 'Test content';

      await writeFile(testFile, content);

      const result = await fs.readFile(testFile, { encoding: 'utf-8' });
      assert.strictEqual(result, content);

      await fs.unlink(testFile);
    });

    it('既存ファイルを上書きする', async () => {
      const tempDir = tmpdir();
      const testFile = path.join(tempDir, 'test-overwrite.txt');
      const initialContent = 'Initial content';
      const newContent = 'New content';

      await fs.writeFile(testFile, initialContent);
      await writeFile(testFile, newContent);

      const result = await fs.readFile(testFile, { encoding: 'utf-8' });
      assert.strictEqual(result, newContent);

      await fs.unlink(testFile);
    });
  });
});
