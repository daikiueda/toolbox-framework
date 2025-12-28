import { spawn } from 'child_process';

import { getSfdxSession } from './SfdxService';

export type AuthOrg = {
  username: string;
  alias?: string;
  instanceUrl: string;
  isDefaultDevHub: boolean;
  isDefaultOrg: boolean;
};

export type AuthCredentials = {
  instanceUrl: string;
  accessToken: string;
};

type SfOrgRecord = {
  username: string;
  alias?: string;
  instanceUrl?: string;
  isDefaultUsername?: boolean;
  isDefaultDevHubUsername?: boolean;
};

type SfOrgListResult = {
  result?: {
    nonScratchOrgs?: SfOrgRecord[];
    scratchOrgs?: SfOrgRecord[];
  };
};

const runSfJsonCommand = async (args: string[]): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const proc = spawn('sf', [...args, '--json'], {
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
      if (code === 0) {
        try {
          resolve(JSON.parse(stdout));
        } catch (error) {
          reject(
            new Error(
              `[SfdxAuthService] JSON パースエラー: ${error}\nstdout: ${stdout}\nstderr: ${stderr}`
            )
          );
        }
      } else {
        reject(new Error(`[SfdxAuthService] sf コマンド失敗 (exit code: ${code}): ${stderr}`));
      }
    });

    proc.on('error', (error) => {
      reject(new Error(`[SfdxAuthService] sf コマンド実行エラー: ${error.message}`));
    });
  });

const listAuthenticatedOrgsWithSf = async (): Promise<AuthOrg[]> => {
  const result = (await runSfJsonCommand(['org', 'list'])) as SfOrgListResult;
  const nonScratchOrgs = result.result?.nonScratchOrgs ?? [];
  const scratchOrgs = result.result?.scratchOrgs ?? [];

  return [...nonScratchOrgs, ...scratchOrgs]
    .filter((org) => org.instanceUrl)
    .map((org) => ({
      username: org.username,
      alias: org.alias,
      instanceUrl: org.instanceUrl!,
      isDefaultDevHub: org.isDefaultDevHubUsername ?? false,
      isDefaultOrg: org.isDefaultUsername ?? false,
    }));
};

/**
 * Salesforce CLI で認証済みの組織一覧を取得
 */
export const getAuthenticatedOrgs = async (): Promise<AuthOrg[]> => {
  try {
    return await listAuthenticatedOrgsWithSf();
  } catch (error) {
    console.error('[SfdxAuthService] 認証済み組織一覧取得エラー:', error);
    return [];
  }
};

/**
 * 指定したユーザー名の認証情報を取得
 * トークンが期限切れの場合は自動的にリフレッシュされる
 */
export const getAuthInfo = async (usernameOrAlias: string): Promise<AuthCredentials> => {
  const session = await getSfdxSession(usernameOrAlias);
  return {
    instanceUrl: session.instanceUrl,
    accessToken: session.accessToken,
  };
};
