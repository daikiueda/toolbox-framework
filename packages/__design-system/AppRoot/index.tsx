import React from 'react';

import { AppEnvProvider } from './AppEnvContext';
import GlobalThemeProvider, { type BackgroundLayer } from './GlobalThemeProvider';

import { ToastContainer } from '../GlobalUI/Toast';

import { AppearanceProvider } from './AppearanceContext';
import { ErrorBoundary } from './ErrorBoundary';

export type { BackgroundLayer };

type Props = {
  children: React.ReactNode;
  onElectron?: boolean;
  backgroundLayer?: BackgroundLayer;
};

// const Compose = ({ items, children }) =>
//   items.reduceRight(
//     (acc, [Component, props]) => React.createElement(Component, props, acc),
//     children
//   );

const AppRoot: React.FC<Props> = ({ children, onElectron = false, backgroundLayer = 'base' }) => {
  return (
    <AppEnvProvider onElectron={onElectron}>
      <AppearanceProvider>
        <GlobalThemeProvider background={backgroundLayer}>
          <ErrorBoundary>{children}</ErrorBoundary>
          <ToastContainer />
        </GlobalThemeProvider>
      </AppearanceProvider>
    </AppEnvProvider>
  );
};
export default AppRoot;
