import React from 'react';

import { AppEnvProvider } from './AppEnvContext';
import GlobalThemeProvider from './GlobalThemeProvider';

import { ToastContainer } from '../GlobalUI/Toast';

import { style } from '../style' with { type: 'macro' };

import { AppearanceProvider } from './AppearanceContext';

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
      <AppearanceProvider>
        <GlobalThemeProvider>
          <div
            className={style({
              display: 'flex',
              width: 'full',
              minHeight: 'screen',
              justifyContent: 'start',
            })}
          >
            {children}
          </div>
          <ToastContainer />
        </GlobalThemeProvider>
      </AppearanceProvider>
    </AppEnvProvider>
  );
};
export default AppRoot;
