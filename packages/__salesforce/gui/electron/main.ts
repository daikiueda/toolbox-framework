import { ipcMain, shell } from 'electron';

import { SalesforceConnection } from '../../lib';
import { OAuthConfig, REDIRECT_URI } from '../../lib/core/auth/OAuthConfig';
import { buildAuthorizationUrl, exchangeCodeForTokens } from '../../lib/core/auth/oauth';
import { PKCEParams } from '../../lib/core/auth/pkce';
import { getOrgInfo } from '../../src/OrgInfo';

import { SALESFORCE_CHANNELS, type SalesforceChannel } from './constants';

let currentPKCEVerifier: string | null = null;
let currentInstanceUrl: string | null = null;
let loginResolve: ((success: boolean) => void) | null = null;

// プロトコルURLハンドラー
const handleProtocolUrl = async (url: string): Promise<void> => {
  if (!url.startsWith(REDIRECT_URI)) {
    return;
  }

  try {
    // URLから認証コードを取得
    const urlObj = new URL(url);
    const code = urlObj.searchParams.get('code');

    if (!code || !currentPKCEVerifier || !currentInstanceUrl) {
      throw new Error('認証コードまたはPKCEパラメータが取得できませんでした');
    }

    console.log('[salesforce] 認証コード受信、トークン交換開始');

    // トークン交換
    const tokens = await exchangeCodeForTokens(
      code,
      currentPKCEVerifier,
      OAuthConfig.generate(currentInstanceUrl)
    );

    // 接続確立
    SalesforceConnection.getInstance().connect(tokens);

    // 状態をクリア
    currentPKCEVerifier = null;
    currentInstanceUrl = null;

    console.log('[salesforce] ログイン成功');

    // ログイン成功を通知
    if (loginResolve) {
      loginResolve(true);
      loginResolve = null;
    }
  } catch (error) {
    console.error('[salesforce] トークン交換エラー:', error);

    // 状態をクリア
    currentPKCEVerifier = null;
    currentInstanceUrl = null;

    // ログイン失敗を通知
    if (loginResolve) {
      loginResolve(false);
      loginResolve = null;
    }
  }
};

// プロトコルURLを処理する（Electron Main Processから呼ばれる）
export const notifySalesforceProtocolUrl = (url: string): void => {
  handleProtocolUrl(url);
};

const registerSalesforceHandlers = () => {
  // ログインハンドラー
  ipcMain.handle(SALESFORCE_CHANNELS.login, async (_event, instanceUrl: string) => {
    try {
      // PKCE生成
      const pkce = PKCEParams.generate();
      currentPKCEVerifier = pkce.code_verifier;
      currentInstanceUrl = instanceUrl;

      // 認証URL構築
      const authUrl = buildAuthorizationUrl(OAuthConfig.generate(currentInstanceUrl), pkce);

      console.log('[salesforce] OS標準ブラウザで認証URLを開く:', authUrl);

      // OS標準ブラウザで認証URLを開く
      await shell.openExternal(authUrl);

      // プロトコルハンドラーからの通知を待つ
      return new Promise<boolean>((resolve) => {
        loginResolve = resolve;

        // タイムアウト（5分）を設定
        setTimeout(
          () => {
            if (loginResolve === resolve) {
              console.log('[salesforce] ログインタイムアウト');
              currentPKCEVerifier = null;
              currentInstanceUrl = null;
              loginResolve = null;
              resolve(false);
            }
          },
          5 * 60 * 1000
        );
      });
    } catch (error) {
      console.error('[salesforce] ログインエラー:', error);
      currentPKCEVerifier = null;
      currentInstanceUrl = null;
      loginResolve = null;
      return false;
    }
  });

  // ログアウトハンドラー
  ipcMain.handle(SALESFORCE_CHANNELS.logout, async () => {
    SalesforceConnection.getInstance().disconnect();
  });

  // 接続状態取得ハンドラー
  ipcMain.handle(SALESFORCE_CHANNELS.getConnectionState, async () =>
    SalesforceConnection.isConnected() ? 'connected' : 'disconnected'
  );

  // 組織情報取得ハンドラー
  ipcMain.handle(SALESFORCE_CHANNELS.getOrgInfo, getOrgInfo);
};

const unregisterSalesforceHandlers = () => {
  // 状態をクリア
  currentPKCEVerifier = null;
  currentInstanceUrl = null;
  loginResolve = null;

  // 接続クリア
  SalesforceConnection.getInstance().disconnect();

  // IPCハンドラー削除
  (Object.values(SALESFORCE_CHANNELS) as SalesforceChannel[]).forEach((channel) => {
    if (ipcMain.listenerCount(channel) > 0) {
      ipcMain.removeHandler(channel);
    }
  });
};

export { registerSalesforceHandlers, unregisterSalesforceHandlers };
