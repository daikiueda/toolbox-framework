import { BrowserWindow, ipcMain } from 'electron';

import {
  CLIENT_ID,
  REDIRECT_URI,
  SalesforceConnection,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  generatePKCEParams,
} from '@toolbox/salesforce/src/core';

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

let authWindow: BrowserWindow | null = null;
let currentPKCEVerifier: string | null = null;

const registerSalesforceHandlers = () => {
  // ログインハンドラー
  ipcMain.handle(SALESFORCE_CHANNELS.login, async (_event, instanceUrl: string) => {
    try {
      // PKCE生成
      const pkceParams = generatePKCEParams();
      currentPKCEVerifier = pkceParams.code_verifier;

      // 認証URL構築
      const authUrl = buildAuthorizationUrl(
        {
          instanceUrl,
          clientId: CLIENT_ID,
          redirectUri: REDIRECT_URI,
        },
        pkceParams
      );

      // 認証ウィンドウを開く
      authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
      });

      authWindow.loadURL(authUrl);
      authWindow.show();

      // リダイレクトURLを監視
      return new Promise<boolean>((resolve, reject) => {
        const handleNavigation = async (url: string) => {
          if (url.startsWith(REDIRECT_URI)) {
            try {
              // URLから認証コードを取得
              const urlObj = new URL(url);
              const code = urlObj.searchParams.get('code');

              if (!code || !currentPKCEVerifier) {
                throw new Error('認証コードまたはPKCEパラメータが取得できませんでした');
              }

              // トークン交換
              const tokens = await exchangeCodeForTokens(code, currentPKCEVerifier, {
                instanceUrl,
                clientId: CLIENT_ID,
                redirectUri: REDIRECT_URI,
              });

              // トークンを保存
              tokenStore.setTokens(tokens);

              // 接続確立
              salesforceConnection.connect(tokens);

              // 認証ウィンドウを閉じる
              authWindow?.close();
              authWindow = null;
              currentPKCEVerifier = null;

              resolve(true);
            } catch (error) {
              console.error('[salesforce] トークン交換エラー:', error);
              authWindow?.close();
              authWindow = null;
              currentPKCEVerifier = null;
              reject(error);
            }
          }
        };

        // ウィンドウのナビゲーションを監視
        authWindow?.webContents.on('will-redirect', (_event, url) => {
          handleNavigation(url);
        });

        authWindow?.webContents.on('did-navigate', (_event, url) => {
          handleNavigation(url);
        });

        // ウィンドウが閉じられた場合
        authWindow?.on('closed', () => {
          authWindow = null;
          currentPKCEVerifier = null;
          resolve(false);
        });
      });
    } catch (error) {
      console.error('[salesforce] ログインエラー:', error);
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
};

const unregisterSalesforceHandlers = () => {
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
