import { createContext } from 'react';

import type { ConnectionState } from '../../lib/models/ConnectionState';
import type { OrgInfo } from '../../src/OrgInfo';

export type SalesforceContextValue = {
  connectionState: ConnectionState;
  orgInfo: OrgInfo | null;
  login: (instanceUrl: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const SalesforceContext = createContext<SalesforceContextValue | null>(null);
