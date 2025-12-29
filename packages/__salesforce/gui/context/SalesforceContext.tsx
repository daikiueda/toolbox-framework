import { createContext } from 'react';

import type { OrgInfo } from '../../lib';
import type { AuthOrgResult } from '../../lib/core/sfdx/SfdxAuthService';
import type { ConnectionState } from '../../lib/models/ConnectionState';

export type SalesforceContextValue = {
  connectionState: ConnectionState;
  isConnectedWithSfdx: boolean;
  orgInfo: OrgInfo | null;
  loginWithOAuth: (instanceUrl: string) => Promise<boolean>;
  loginWithSfdx: (instanceUrl: string) => Promise<boolean>;
  loginWithAuthOrg: (usernameOrAlias: string) => Promise<boolean>;
  getAuthenticatedOrgs: () => Promise<AuthOrgResult>;
  logout: () => Promise<void>;
  LoginGate: React.ComponentType<{ children: React.ReactNode }>;
};

export const SalesforceContext = createContext<SalesforceContextValue | null>(null);
