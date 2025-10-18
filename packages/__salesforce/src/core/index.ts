// Renderer Processから使用する定数とクラスのみエクスポート
export { CLIENT_ID, REDIRECT_URI, INSTANCE_URLS } from './constants';
export { SalesforceConnection } from './connection';

// pkce と oauth はMain Processでのみ使用（Node.js cryptoモジュールに依存）
// Main Processから直接インポートすること:
// import { generatePKCEParams } from '@toolbox/salesforce/src/core/pkce';
// import { buildAuthorizationUrl, exchangeCodeForTokens } from '@toolbox/salesforce/src/core/oauth';
