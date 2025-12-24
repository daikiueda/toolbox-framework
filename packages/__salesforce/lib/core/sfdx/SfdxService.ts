import { spawn } from 'child_process';

import type { SfdxSession } from './types';

/**
 * sf org login web を実行してブラウザでログイン
 * @returns ログインしたユーザー名
 */
export const sfdxLoginAndDetectUsername = async (instanceUrl?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const args = ['org', 'login', 'web'];
    if (instanceUrl) {
      args.push('--instance-url', instanceUrl);
    }

    console.log('[SfdxService] sf コマンドを実行:', 'sf', args.join(' '));

    const proc = spawn('sf', args, {
      env: {
        ...process.env,
        SF_SKIP_NEW_VERSION_CHECK: 'true',
      },
    });
    let stdout = '';
    let resolved = false;

    proc.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      console.log(output);

      // 認証成功メッセージを検出したら即座にresolve
      if (!resolved) {
        const match = stdout.match(/Successfully authorized (.+?) with org ID/);
        if (match && match[1]) {
          const username = match[1];
          console.log('[SfdxService] ログイン成功（即座に返却）:', username);
          resolved = true;
          resolve(username);
        }
      }
    });

    proc.stderr.on('data', (data) => {
      const output = data.toString();
      console.log(output);
    });

    proc.on('close', (code) => {
      if (!resolved) {
        if (code === 0) {
          reject(new Error('[SfdxService] ログイン成功したが、ユーザー名を抽出できませんでした'));
        } else {
          reject(new Error(`[SfdxService] ログイン失敗: exit code ${code}`));
        }
      }
    });

    proc.on('error', (error) => {
      if (!resolved) {
        reject(new Error(`[SfdxService] sf コマンド実行エラー: ${error.message}`));
      }
    });
  });
};

/**
 * sf org display を実行してセッション情報を取得
 */
export const getSfdxSession = async (username?: string): Promise<SfdxSession> => {
  return new Promise((resolve, reject) => {
    const args = ['org', 'display', '--json'];
    if (username) {
      args.push('--target-org', username);
    }

    console.log('[SfdxService] sf コマンドを実行:', 'sf', args.join(' '));

    const proc = spawn('sf', args, {
      env: {
        ...process.env,
        SF_SKIP_NEW_VERSION_CHECK: 'true',
      },
    });
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      console.log('[SfdxService] sf コマンド終了コード:', code);
      console.log('[SfdxService] stdout:', stdout);
      console.log('[SfdxService] stderr:', stderr);

      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          const session: SfdxSession = {
            instanceUrl: result.result.instanceUrl,
            accessToken: result.result.accessToken,
            username: result.result.username,
            orgId: result.result.id,
          };
          console.log('[SfdxService] Org情報取得成功:', session.username);

          if (stderr) {
            console.warn('[SfdxService] 警告:', stderr);
          }

          resolve(session);
        } catch (error) {
          reject(
            new Error(
              `[SfdxService] JSON パースエラー: ${error}\nstdout: ${stdout}\nstderr: ${stderr}`
            )
          );
        }
      } else {
        reject(new Error(`[SfdxService] sf コマンド失敗 (exit code: ${code}): ${stderr}`));
      }
    });

    proc.on('error', (error) => {
      reject(new Error(`[SfdxService] sf コマンド実行エラー: ${error.message}`));
    });
  });
};
