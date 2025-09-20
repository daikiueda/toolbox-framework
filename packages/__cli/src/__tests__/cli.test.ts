import assert from 'node:assert';
import { describe, it, mock } from 'node:test';

import cli, { type Examples, type Options } from '../index';

describe('cli関数', () => {
  it('オプション無しで基本的なCLIを作成できる', async () => {
    const mockExec = mock.fn();

    const originalArgv = process.argv;
    const originalIsTTY = process.stdin.isTTY;

    process.argv = ['node', 'script.js'];
    process.stdin.isTTY = true; // TTYとしてマークしてstdin読み取りを回避

    const cliFunction = cli({}, mockExec);
    await cliFunction();

    process.argv = originalArgv;
    process.stdin.isTTY = originalIsTTY;

    assert.strictEqual(mockExec.mock.calls.length, 1);

    const call = mockExec.mock.calls[0];
    assert.ok(call.arguments[0].argv);
    assert.ok(call.arguments[0].yargs);
    assert.strictEqual(call.arguments[0].stdin, null); // TTYの場合はnull
  });

  it('オプションを含むCLIを作成できる', async () => {
    const mockExec = mock.fn();

    const options: Options<{ verbose: boolean; output: string }> = {
      verbose: {
        type: 'boolean',
        description: 'Verbose output',
      },
      output: {
        type: 'string',
        description: 'Output file',
        default: 'output.txt',
      },
    };

    const originalArgv = process.argv;
    const originalIsTTY = process.stdin.isTTY;

    process.argv = ['node', 'script.js', '--verbose', '--output', 'test.txt'];
    process.stdin.isTTY = true;

    const cliFunction = cli({ options }, mockExec);
    await cliFunction();

    process.argv = originalArgv;
    process.stdin.isTTY = originalIsTTY;

    assert.strictEqual(mockExec.mock.calls.length, 1);

    const call = mockExec.mock.calls[0];
    const argv = call.arguments[0].argv;

    assert.strictEqual(argv.verbose, true);
    assert.strictEqual(argv.output, 'test.txt');
  });

  it('使用例を含むCLIを作成できる', async () => {
    const mockExec = mock.fn();

    const examples: Examples = [
      ['$0 --verbose', '詳細出力を有効にして実行'],
      ['$0 --output file.txt', 'ファイルに出力'],
    ];

    const originalArgv = process.argv;
    const originalIsTTY = process.stdin.isTTY;

    process.argv = ['node', 'script.js'];
    process.stdin.isTTY = true;

    const cliFunction = cli({ examples }, mockExec);
    await cliFunction();

    process.argv = originalArgv;
    process.stdin.isTTY = originalIsTTY;

    assert.strictEqual(mockExec.mock.calls.length, 1);
  });

  it('execでエラーが発生した場合、例外が伝播する', async () => {
    const testError = new Error('Test error');
    const mockExec = mock.fn(() => {
      throw testError;
    });

    const originalArgv = process.argv;
    const originalIsTTY = process.stdin.isTTY;

    process.argv = ['node', 'script.js'];
    process.stdin.isTTY = true;

    const cliFunction = cli({}, mockExec);

    await assert.rejects(
      () => cliFunction(),
      (err) => err === testError
    );

    process.argv = originalArgv;
    process.stdin.isTTY = originalIsTTY;
  });

  it('非同期execでエラーが発生した場合、例外が伝播する', async () => {
    const testError = new Error('Async test error');
    const mockExec = mock.fn(async () => {
      throw testError;
    });

    const originalArgv = process.argv;
    const originalIsTTY = process.stdin.isTTY;

    process.argv = ['node', 'script.js'];
    process.stdin.isTTY = true;

    const cliFunction = cli({}, mockExec);

    await assert.rejects(
      () => cliFunction(),
      (err) => err === testError
    );

    process.argv = originalArgv;
    process.stdin.isTTY = originalIsTTY;
  });
});
