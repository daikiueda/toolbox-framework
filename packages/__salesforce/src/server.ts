// 純粋な Node.js 環境用
export { SalesforceConnection } from './core/SalesforceConnection';
export {
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
} from './core/auth/oauth';
export type { OAuthConfig, OrgInfo, ConnectionState } from './models';
