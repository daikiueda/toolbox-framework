export type InstanceUrlType = 'production' | 'sandbox' | 'custom';

export const GENERAL_INSTANCE_URLS = {
  PRODUCTION: 'https://login.salesforce.com',
  SANDBOX: 'https://test.salesforce.com',
} as const;
