export {
  registerSalesforceHandlers,
  unregisterSalesforceHandlers,
  notifyProtocolUrl,
} from './main';
export { buildSalesforceAPI } from './preload';
export type { SalesforceAPI, SalesforceTokens, ConnectionState, OrgInfo } from './shared';
