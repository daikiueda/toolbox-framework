import React, { useCallback } from 'react';

import LoginPage from '../components/LoginPage';
import { useSalesforceInternal } from '../context/useSalesforceInternal';

type UseSalesforceOptions = {
  requireSfdxSession?: boolean;
};

export const useSalesforce = ({ requireSfdxSession = false }: UseSalesforceOptions = {}) => {
  const { login, loginWithSfdx, connectionState, isConnectedWithSfdx, orgInfo } =
    useSalesforceInternal();

  const LoginGate = useCallback(
    ({ children }: { children: React.ReactNode }) => {
      // 接続状態をチェック
      const isConnected = connectionState === 'connected';

      // sfdx 必須の場合、sfdx で接続されているかもチェック
      const isSfdxConnectionValid = requireSfdxSession ? isConnectedWithSfdx : true;

      return isConnected && isSfdxConnectionValid ? (
        children
      ) : (
        <LoginPage
          onLogin={login}
          useSfdxSession={requireSfdxSession}
          onLoginWithSfdx={loginWithSfdx}
        />
      );
    },
    [connectionState, isConnectedWithSfdx, login, loginWithSfdx, requireSfdxSession]
  );

  return { LoginGate, orgInfo };
};
