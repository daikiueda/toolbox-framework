import type { OrgInfo } from '../../lib';
import type { ConnectionState } from '../../lib/models/ConnectionState';

export const SALESFORCE_CHANNELS = {
  login: 'salesforce:login',
  logout: 'salesforce:logout',
  getOrgInfo: 'salesforce:get-org-info',
  getConnectionState: 'salesforce:get-connection-state',
} as const;

export type SalesforceChannel = (typeof SALESFORCE_CHANNELS)[keyof typeof SALESFORCE_CHANNELS];

export type SalesforceAPI = {
  login: (instanceUrl: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getOrgInfo: () => Promise<OrgInfo | null>;
  getConnectionState: () => Promise<ConnectionState>;
};
