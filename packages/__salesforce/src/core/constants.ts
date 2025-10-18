import rootPackageJson from '../../../../package.json';

// 環境変数SALESFORCE_CLIENT_IDから読み込む（.env.localで設定）
export const CLIENT_ID = process.env.SALESFORCE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';

export const REDIRECT_URI = `${rootPackageJson.name}://oauth/callback`;

export const INSTANCE_URLS = {
  PRODUCTION: 'https://login.salesforce.com',
  SANDBOX: 'https://test.salesforce.com',
} as const;
