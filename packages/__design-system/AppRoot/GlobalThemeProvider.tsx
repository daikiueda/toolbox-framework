import React from 'react';

import { Provider } from '@react-spectrum/provider';
import { theme } from '@react-spectrum/theme-default';

import { type AppearanceMode, useAppearance } from '../hooks';

import './GlobalThemeProvider.scss';

const injectClassNameToDocumentElement = (mode: AppearanceMode) => {
  const documentElement = document.documentElement;

  const prevClassName = documentElement.className.trim();
  const nextClassName = [
    ...prevClassName.split(' ').filter((v) => !v.startsWith('spectrum')),
    'spectrum',
    'spectrum--medium',
    `spectrum--${mode}`,
  ].join(' ');

  if (nextClassName !== prevClassName) {
    documentElement.className = nextClassName.trim();
  }
};

const GlobalThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useAppearance();

  React.useEffect(() => {
    injectClassNameToDocumentElement(mode);
  }, [mode]);

  return (
    <Provider theme={theme} colorScheme={mode}>
      {children}
    </Provider>
  );
};
export default GlobalThemeProvider;
