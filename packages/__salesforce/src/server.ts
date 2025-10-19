// 純粋な Node.js 環境用
export { SalesforceConnection } from './core/connection';
export { getSalesforceConnection, resetSalesforceConnection } from './core/singleton';
export {
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
} from './core/auth/oauth';
export { CLIENT_ID, REDIRECT_URI, INSTANCE_URLS } from './core/constants';
export type { SalesforceTokens, OAuthConfig, OrgInfo, ConnectionState } from './models';
