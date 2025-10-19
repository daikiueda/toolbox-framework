export {
  registerSalesforceHandlers,
  unregisterSalesforceHandlers,
  notifyProtocolUrl,
} from './main';
export { buildSalesforceAPI } from './preload';
export type { SalesforceAPI, ConnectionState, OrgInfo } from './shared';
