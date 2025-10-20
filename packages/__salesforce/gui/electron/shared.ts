import type { ConnectionState, OrgInfo } from '../../src/models';

export const SALESFORCE_CHANNELS = {
  login: 'salesforce:login',
  logout: 'salesforce:logout',
  getOrgInfo: 'salesforce:get-org-info',
  getConnectionState: 'salesforce:get-connection-state',
  query: 'salesforce:query',
} as const;

export type SalesforceChannel = (typeof SALESFORCE_CHANNELS)[keyof typeof SALESFORCE_CHANNELS];

export type SalesforceAPI = {
  login: (instanceUrl: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getOrgInfo: () => Promise<OrgInfo | null>;
  getConnectionState: () => Promise<ConnectionState>;
  query: <T extends Record<string, unknown>>(soql: string) => Promise<{ records: T[] }>;
};
