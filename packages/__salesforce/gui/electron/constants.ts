import type { OrgInfo } from '../../lib';
import type { AuthOrgResult } from '../../lib/core/sfdx/SfdxAuthService';
import type { ConnectionState } from '../../lib/models/ConnectionState';

export const SALESFORCE_CHANNELS = {
  loginWithOAuth: 'salesforce:login-with-oauth',
  loginWithSfdx: 'salesforce:login-with-sfdx',
  loginWithAuthOrg: 'salesforce:login-with-auth-org',
  getAuthenticatedOrgs: 'salesforce:get-authenticated-orgs',
  logout: 'salesforce:logout',
  getOrgInfo: 'salesforce:get-org-info',
  getConnectionState: 'salesforce:get-connection-state',
  isConnectedWithSfdx: 'salesforce:is-connected-with-sfdx',
} as const;

export type SalesforceChannel = (typeof SALESFORCE_CHANNELS)[keyof typeof SALESFORCE_CHANNELS];

export type SalesforceAPI = {
  loginWithOAuth: (instanceUrl: string) => Promise<boolean>;
  loginWithSfdx: (instanceUrl: string) => Promise<boolean>;
  loginWithAuthOrg: (usernameOrAlias: string) => Promise<boolean>;
  getAuthenticatedOrgs: () => Promise<AuthOrgResult>;
  logout: () => Promise<void>;
  getOrgInfo: () => Promise<OrgInfo | null>;
  getConnectionState: () => Promise<ConnectionState>;
  isConnectedWithSfdx: () => Promise<boolean>;
};
