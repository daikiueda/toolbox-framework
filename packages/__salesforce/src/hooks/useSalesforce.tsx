import { useEffect, useState } from 'react';

import { SalesforceConnection } from '../core';
import type { ConnectionState, OrgInfo } from '../models';

type UseSalesforceReturn = {
  connectionState: ConnectionState;
  orgInfo: OrgInfo | null;
  connection: SalesforceConnection | null;
  login: (instanceUrl: string) => Promise<boolean>;
  logout: () => Promise<void>;
  LoginGate: React.FC<{ children: React.ReactNode }>;
};

export const useSalesforce = (): UseSalesforceReturn => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [orgInfo, setOrgInfo] = useState<OrgInfo | null>(null);
  const [connection] = useState<SalesforceConnection>(() => new SalesforceConnection());

  // 初期状態の取得
  useEffect(() => {
    const fetchConnectionState = async () => {
      if (window.api?.salesforce) {
        const state = await window.api.salesforce.getConnectionState();
        setConnectionState(state);
      }
    };

    fetchConnectionState();
  }, []);

  // 組織情報の取得
  useEffect(() => {
    const fetchOrgInfo = async () => {
      if (connectionState === 'connected' && window.api?.salesforce) {
        const info = await window.api.salesforce.getOrgInfo();
        setOrgInfo(info);
      } else {
        setOrgInfo(null);
      }
    };

    fetchOrgInfo();
  }, [connectionState]);

  const login = async (instanceUrl: string): Promise<boolean> => {
    if (!window.api?.salesforce) {
      console.error('[useSalesforce] Salesforce API が利用できません');
      return false;
    }

    try {
      setConnectionState('connecting');
      const success = await window.api.salesforce.login(instanceUrl);

      if (success) {
        setConnectionState('connected');
        return true;
      } else {
        setConnectionState('disconnected');
        return false;
      }
    } catch (error) {
      console.error('[useSalesforce] ログインエラー:', error);
      setConnectionState('error');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    if (!window.api?.salesforce) {
      console.error('[useSalesforce] Salesforce API が利用できません');
      return;
    }

    try {
      await window.api.salesforce.logout();
      setConnectionState('disconnected');
      setOrgInfo(null);
      connection.disconnect();
    } catch (error) {
      console.error('[useSalesforce] ログアウトエラー:', error);
    }
  };

  const LoginGate = ({ children }: { children: React.ReactNode }): JSX.Element | null => {
    if (connectionState === 'connected') {
      return <>{children}</>;
    }

    return null;
  };

  return {
    connectionState,
    orgInfo,
    connection: connectionState === 'connected' ? connection : null,
    login,
    logout,
    LoginGate,
  };
};
