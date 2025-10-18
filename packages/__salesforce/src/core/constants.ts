import rootPackageJson from '../../../../package.json';

// TODO: 環境変数から注入する仕組みを実装（開発時はハードコード）
export const CLIENT_ID = process.env.SALESFORCE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';

export const REDIRECT_URI = `${rootPackageJson.name}://oauth/callback`;

export const INSTANCE_URLS = {
  PRODUCTION: 'https://login.salesforce.com',
  SANDBOX: 'https://test.salesforce.com',
} as const;
