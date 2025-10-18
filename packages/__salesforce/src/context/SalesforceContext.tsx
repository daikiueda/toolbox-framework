import { createContext } from 'react';

import type { ConnectionState, OrgInfo } from '../models';

export type SalesforceContextValue = {
  connectionState: ConnectionState;
  orgInfo: OrgInfo | null;
  query: <T extends Record<string, unknown>>(soql: string) => Promise<{ records: T[] }>;
  login: (instanceUrl: string) => Promise<boolean>;
  logout: () => Promise<void>;
  LoginGate: React.FC<{ children: React.ReactNode }>;
};

export const SalesforceContext = createContext<SalesforceContextValue | null>(null);
