import React, { useCallback } from 'react';

import LoginPage from '../components/LoginPage';
import { useSalesforceInternal } from '../context/useSalesforceInternal';

export const useSalesforce = () => {
  const { login, connectionState, orgInfo } = useSalesforceInternal();

  const LoginGate = useCallback(
    ({ children }: { children: React.ReactNode }) =>
      connectionState === 'connected' ? children : <LoginPage onLogin={login} />,
    [connectionState]
  );

  return { LoginGate, orgInfo };
};
