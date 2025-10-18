import { ipcMain, shell } from 'electron';

import { CLIENT_ID, REDIRECT_URI } from '@toolbox/salesforce/src/core';
import { SalesforceConnection } from '@toolbox/salesforce/src/core/connection';
import { buildAuthorizationUrl, exchangeCodeForTokens } from '@toolbox/salesforce/src/core/oauth';
import { generatePKCEParams } from '@toolbox/salesforce/src/core/pkce';

import { setProtocolUrlHandler } from '../../main';

import { SALESFORCE_CHANNELS, type SalesforceChannel, type SalesforceTokens } from './shared';

class InMemoryTokenStore {
  private tokens: SalesforceTokens | null = null;

  setTokens = (tokens: SalesforceTokens): void => {
    this.tokens = tokens;
  };

  getTokens = (): SalesforceTokens | null => {
    return this.tokens;
  };

  clearTokens = (): void => {
    this.tokens = null;
  };
}

const tokenStore = new InMemoryTokenStore();
const salesforceConnection = new SalesforceConnection();

let currentPKCEVerifier: string | null = null;
let currentInstanceUrl: string | null = null;
let loginResolve: ((success: boolean) => void) | null = null;

const registerSalesforceHandlers = () => {
  // プロトコルURLハンドラーを登録
  setProtocolUrlHandler(async (url: string) => {
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
      const tokens = await exchangeCodeForTokens(code, currentPKCEVerifier, {
        instanceUrl: currentInstanceUrl,
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
      });

      // トークンを保存
      tokenStore.setTokens(tokens);

      // 接続確立
      salesforceConnection.connect(tokens);

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
  });

  // ログインハンドラー
  ipcMain.handle(SALESFORCE_CHANNELS.login, async (_event, instanceUrl: string) => {
    try {
      // PKCE生成
      const pkceParams = generatePKCEParams();
      currentPKCEVerifier = pkceParams.code_verifier;
      currentInstanceUrl = instanceUrl;

      // 認証URL構築
      const authUrl = buildAuthorizationUrl(
        {
          instanceUrl,
          clientId: CLIENT_ID,
          redirectUri: REDIRECT_URI,
        },
        pkceParams
      );

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
    tokenStore.clearTokens();
    salesforceConnection.disconnect();
  });

  // 組織情報取得ハンドラー
  ipcMain.handle(SALESFORCE_CHANNELS.getOrgInfo, async () => {
    try {
      const tokens = tokenStore.getTokens();
      if (!tokens) {
        return null;
      }

      return await salesforceConnection.getOrgInfo();
    } catch (error) {
      console.error('[salesforce] 組織情報取得エラー:', error);
      return null;
    }
  });

  // 接続状態取得ハンドラー
  ipcMain.handle(SALESFORCE_CHANNELS.getConnectionState, async () => {
    const tokens = tokenStore.getTokens();
    return tokens ? 'connected' : 'disconnected';
  });

  // SOQLクエリ実行ハンドラー
  ipcMain.handle(SALESFORCE_CHANNELS.query, async (_event, soql: string) => {
    try {
      const tokens = tokenStore.getTokens();
      if (!tokens) {
        throw new Error('Salesforceに接続されていません');
      }

      return await salesforceConnection.query(soql);
    } catch (error) {
      console.error('[salesforce] クエリ実行エラー:', error);
      throw error;
    }
  });
};

const unregisterSalesforceHandlers = () => {
  // プロトコルハンドラーをクリア
  setProtocolUrlHandler(null);

  // 状態をクリア
  currentPKCEVerifier = null;
  currentInstanceUrl = null;
  loginResolve = null;

  // トークンクリア
  tokenStore.clearTokens();
  salesforceConnection.disconnect();

  // IPCハンドラー削除
  (Object.values(SALESFORCE_CHANNELS) as SalesforceChannel[]).forEach((channel) => {
    if (ipcMain.listenerCount(channel) > 0) {
      ipcMain.removeHandler(channel);
    }
  });
};

export { registerSalesforceHandlers, unregisterSalesforceHandlers, tokenStore };
