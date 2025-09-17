import React from 'react';

import { AppEnvProvider } from './AppEnvContext';
import GlobalThemeProvider from './GlobalThemeProvider';

import { ToastContainer } from '../GlobalUI/Toast';

import { Flex } from '../Components/Layout';

import './BaseStyle.scss';

type Props = {
  children: React.ReactNode;
  onElectron?: boolean;
};

// const Compose = ({ items, children }) =>
//   items.reduceRight(
//     (acc, [Component, props]) => React.createElement(Component, props, acc),
//     children
//   );

const AppRoot: React.FC<Props> = ({ children, onElectron = false }) => {
  return (
    <AppEnvProvider onElectron={onElectron}>
      <GlobalThemeProvider>
        <Flex width="100%" minHeight="100vh" justifyContent="start">
          {children}
        </Flex>
        <ToastContainer />
      </GlobalThemeProvider>
    </AppEnvProvider>
  );
};
export default AppRoot;
