import rootPackageJson from '../../../../../package.json';

export type OAuthConfig = {
  clientId: string;
  redirectUri: string;
  instanceUrl: string;
};

// ビルド時に環境変数から埋め込まれる（electron.vite.config.tsのdefineで設定）
// 開発時: .envのVITE_SALESFORCE_CLIENT_IDから読み込む
// 本番時: ビルド時の環境変数VITE_SALESFORCE_CLIENT_IDから埋め込まれる
const CLIENT_ID = import.meta.env.VITE_SALESFORCE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';

export const REDIRECT_URI = `${rootPackageJson.name}://oauth/callback`;

export const OAuthConfig = {
  generate: (instanceUrl: string): OAuthConfig => ({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    instanceUrl,
  }),
};
