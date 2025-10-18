import type { SalesforceAPI } from '../../../__electron/src/__extensions/salesforce/shared';

declare global {
  interface Window {
    api?: {
      salesforce?: SalesforceAPI;
    };
  }
}

export {};
