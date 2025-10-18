import { useCallback, useEffect, useMemo, useState } from 'react';

import type { ConnectionState, OrgInfo } from '../models';

import { SalesforceContext, type SalesforceContextValue } from './SalesforceContext';

export const SalesforceProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [orgInfo, setOrgInfo] = useState<OrgInfo | null>(null);

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

  const login = useCallback(async (instanceUrl: string): Promise<boolean> => {
    if (!window.api?.salesforce) {
      console.error('[SalesforceProvider] Salesforce API が利用できません');
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
      console.error('[SalesforceProvider] ログインエラー:', error);
      setConnectionState('error');
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    if (!window.api?.salesforce) {
      console.error('[SalesforceProvider] Salesforce API が利用できません');
      return;
    }

    try {
      await window.api.salesforce.logout();
      setConnectionState('disconnected');
      setOrgInfo(null);
    } catch (error) {
      console.error('[SalesforceProvider] ログアウトエラー:', error);
    }
  }, []);

  const query = useCallback(
    async <T extends Record<string, unknown>>(soql: string): Promise<{ records: T[] }> => {
      if (!window.api?.salesforce) {
        throw new Error('[SalesforceProvider] Salesforce API が利用できません');
      }

      return window.api.salesforce.query<T>(soql);
    },
    []
  );

  const LoginGate = useMemo(() => {
    const Component = ({ children }: { children: React.ReactNode }): JSX.Element | null => {
      if (connectionState === 'connected') {
        return <>{children}</>;
      }

      return null;
    };
    Component.displayName = 'LoginGate';
    return Component;
  }, [connectionState]);

  const value: SalesforceContextValue = useMemo(
    () => ({
      connectionState,
      orgInfo,
      query,
      login,
      logout,
      LoginGate,
    }),
    [connectionState, orgInfo, query, login, logout, LoginGate]
  );

  return <SalesforceContext.Provider value={value}>{children}</SalesforceContext.Provider>;
};
