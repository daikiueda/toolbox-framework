// Electron Main Process 統合用
export {
  registerSalesforceHandlers,
  unregisterSalesforceHandlers,
  notifyProtocolUrl,
} from './electron/main';
export { buildSalesforceAPI } from './electron/preload';
export type { SalesforceAPI, ConnectionState, OrgInfo } from './electron/shared';
