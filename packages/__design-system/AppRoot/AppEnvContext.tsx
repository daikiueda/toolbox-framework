import React, { createContext } from 'react';

type AppEnvContext = {
  onElectron?: boolean;
};
export const AppEnvContext = createContext<AppEnvContext>({});

export const AppEnvProvider: React.FC<AppEnvContext & { children: React.ReactNode }> = ({
  children,
  ...values
}) => <AppEnvContext.Provider value={values}>{children}</AppEnvContext.Provider>;
