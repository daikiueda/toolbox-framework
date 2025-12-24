import { createContext } from 'react';

import type { OrgInfo } from '../../lib';
import type { ConnectionState } from '../../lib/models/ConnectionState';

export type SalesforceContextValue = {
  connectionState: ConnectionState;
  isConnectedWithSfdx: boolean;
  orgInfo: OrgInfo | null;
  login: (instanceUrl: string) => Promise<boolean>;
  loginWithSfdx: (instanceUrl?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  LoginGate: React.ComponentType<{ children: React.ReactNode }>;
};

export const SalesforceContext = createContext<SalesforceContextValue | null>(null);
