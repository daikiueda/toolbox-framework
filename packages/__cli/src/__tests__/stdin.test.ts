import assert from 'node:assert';
import { describe, it, mock } from 'node:test';

import cli from '../index';

describe('stdin処理', () => {
  it('TTY環境ではstdinがnullになる', async () => {
    const mockExec = mock.fn();

    const originalIsTTY = process.stdin.isTTY;
    process.stdin.isTTY = true;

    const originalArgv = process.argv;
    process.argv = ['node', 'script.js'];

    const cliFunction = cli({}, mockExec);
    await cliFunction();

    process.argv = originalArgv;
    process.stdin.isTTY = originalIsTTY;

    assert.strictEqual(mockExec.mock.calls.length, 1);

    const call = mockExec.mock.calls[0];
    assert.strictEqual(call.arguments[0].stdin, null);
  });
});
