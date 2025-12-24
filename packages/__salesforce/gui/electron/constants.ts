import type { OrgInfo } from '../../lib';
import type { ConnectionState } from '../../lib/models/ConnectionState';

export const SALESFORCE_CHANNELS = {
  loginWithOAuth: 'salesforce:login-with-oauth',
  loginWithSfdx: 'salesforce:login-with-sfdx',
  logout: 'salesforce:logout',
  getOrgInfo: 'salesforce:get-org-info',
  getConnectionState: 'salesforce:get-connection-state',
  isConnectedWithSfdx: 'salesforce:is-connected-with-sfdx',
} as const;

export type SalesforceChannel = (typeof SALESFORCE_CHANNELS)[keyof typeof SALESFORCE_CHANNELS];

export type SalesforceAPI = {
  loginWithOAuth: (instanceUrl: string) => Promise<boolean>;
  loginWithSfdx: (instanceUrl: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getOrgInfo: () => Promise<OrgInfo | null>;
  getConnectionState: () => Promise<ConnectionState>;
  isConnectedWithSfdx: () => Promise<boolean>;
};
