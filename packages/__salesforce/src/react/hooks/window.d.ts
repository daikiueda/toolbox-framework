import type { SalesforceAPI } from '@toolbox/electron/src/__extensions/salesforce/shared';

declare global {
  interface Window {
    api?: {
      salesforce?: SalesforceAPI;
    };
  }
}

export {};
