import { useCallback, useEffect, useMemo, useState } from 'react';

import type { OrgInfo } from '../../lib';
import type { ConnectionState } from '../../lib/models/ConnectionState';

import { SalesforceContext, type SalesforceContextValue } from './SalesforceContext';

export const SalesforceProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [isConnectedWithSfdx, setIsConnectedWithSfdx] = useState<boolean>(false);
  const [orgInfo, setOrgInfo] = useState<OrgInfo | null>(null);

  // 初期状態の取得
  useEffect(() => {
    const fetchConnectionState = async () => {
      if (window.api?.salesforce) {
        const state = await window.api.salesforce.getConnectionState();
        setConnectionState(state);

        if (state === 'connected') {
          const isSfdx = await window.api.salesforce.isConnectedWithSfdx();
          setIsConnectedWithSfdx(isSfdx);
        } else {
          setIsConnectedWithSfdx(false);
        }
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
      console.error('[salesforce] Salesforce API が利用できません');
      return false;
    }

    try {
      setConnectionState('connecting');
      const success = await window.api.salesforce.login(instanceUrl);

      if (success) {
        setConnectionState('connected');
        setIsConnectedWithSfdx(false);
        return true;
      } else {
        setConnectionState('disconnected');
        setIsConnectedWithSfdx(false);
        return false;
      }
    } catch (error) {
      console.error('[salesforce] ログインエラー:', error);
      setConnectionState('error');
      setIsConnectedWithSfdx(false);
      return false;
    }
  }, []);

  const loginWithSfdx = useCallback(async (instanceUrl?: string): Promise<boolean> => {
    if (!window.api?.salesforce) {
      console.error('[salesforce] Salesforce API が利用できません');
      return false;
    }

    try {
      setConnectionState('connecting');
      const success = await window.api.salesforce.loginWithSfdx(instanceUrl);

      if (success) {
        setConnectionState('connected');
        setIsConnectedWithSfdx(true);
        return true;
      } else {
        setConnectionState('disconnected');
        setIsConnectedWithSfdx(false);
        return false;
      }
    } catch (error) {
      console.error('[salesforce] sfdx ログインエラー:', error);
      setConnectionState('error');
      setIsConnectedWithSfdx(false);
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    if (!window.api?.salesforce) {
      console.error('[salesforce] Salesforce API が利用できません');
      return;
    }

    try {
      await window.api.salesforce.logout();
      setConnectionState('disconnected');
      setIsConnectedWithSfdx(false);
      setOrgInfo(null);
    } catch (error) {
      console.error('[salesforce] ログアウトエラー:', error);
    }
  }, []);

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
      isConnectedWithSfdx,
      orgInfo,
      login,
      loginWithSfdx,
      logout,
      LoginGate,
    }),
    [connectionState, isConnectedWithSfdx, orgInfo, login, loginWithSfdx, logout, LoginGate]
  );

  return <SalesforceContext.Provider value={value}>{children}</SalesforceContext.Provider>;
};
