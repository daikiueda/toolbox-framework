import React from 'react';

import { Provider } from '@react-spectrum/provider';
import { theme } from '@react-spectrum/theme-default';

import './ThemeProvider.scss';

const injectClassNameToDocumentElement = () => {
  const documentElement = document.documentElement;

  const prevClassName = documentElement.className.trim();
  const nextClassName = [
    ...prevClassName.split(' ').filter((v) => !v.startsWith('spectrum')),
    'spectrum',
    `spectrum--${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}`,
  ].join(' ');

  if (nextClassName !== prevClassName) {
    documentElement.className = nextClassName.trim();
  }
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(injectClassNameToDocumentElement, []);
  return <Provider theme={theme}>{children}</Provider>;
};
export default ThemeProvider;
