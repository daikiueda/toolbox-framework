export {
  registerSalesforceHandlers,
  unregisterSalesforceHandlers,
  notifySalesforceProtocolUrl,
} from './main';
export { buildSalesforceAPI } from './preload';

export type { SalesforceAPI } from './constants';

export { SalesforceProvider } from '../context/SalesforceProvider';
