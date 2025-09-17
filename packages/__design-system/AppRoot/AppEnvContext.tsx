import React, { createContext } from 'react';

type AppEnvContextValue = {
  onElectron?: boolean;
};
export const AppEnvContext = createContext<AppEnvContextValue>({});

export const AppEnvProvider: React.FC<AppEnvContextValue & { children: React.ReactNode }> = ({
  children,
  ...values
}) => <AppEnvContext.Provider value={values}>{children}</AppEnvContext.Provider>;
