// Renderer Processから使用する定数のみエクスポート
export { CLIENT_ID, REDIRECT_URI, INSTANCE_URLS } from './constants';

// 以下はMain Processでのみ使用（Node.js依存モジュールを含む）
// Main Processから直接インポートすること:
// import { SalesforceConnection } from '@toolbox/salesforce/src/core/connection';
// import { generatePKCEParams } from '@toolbox/salesforce/src/core/pkce';
// import { buildAuthorizationUrl, exchangeCodeForTokens } from '@toolbox/salesforce/src/core/oauth';
