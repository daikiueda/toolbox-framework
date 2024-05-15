import React from 'react';

import { Flex } from '../Components/Layout';

import { AppEnvProvider } from './AppEnvContext';
import GlobalThemeProvider from './GlobalThemeProvider';

type Props = {
  children: React.ReactNode;
  onElectron?: boolean;
};

const AppRoot: React.FC<Props> = ({ children, onElectron = false }) => {
  return (
    <AppEnvProvider onElectron={onElectron}>
      <GlobalThemeProvider>
        <Flex width="100%" minHeight="100vh" justifyContent="start">
          {children}
        </Flex>
      </GlobalThemeProvider>
    </AppEnvProvider>
  );
};
export default AppRoot;
