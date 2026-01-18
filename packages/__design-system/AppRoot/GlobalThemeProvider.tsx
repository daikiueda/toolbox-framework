import React from 'react';

import { Provider } from '@react-spectrum/s2';

import { useAppearance } from '../hooks';

import { type AppearanceMode } from './AppearanceContext';

import './GlobalThemeProvider.scss';

export type BackgroundLayer = 'base' | 'layer-1' | 'layer-2';

const injectClassNameToDocumentElement = (mode: AppearanceMode, background?: BackgroundLayer) => {
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

  // Set background layer for Spectrum 2
  // 'base' means no attribute (default style)
  if (background && background !== 'base') {
    documentElement.setAttribute('data-background', background);
  } else {
    documentElement.removeAttribute('data-background');
  }
};

const GlobalThemeProvider: React.FC<{
  children: React.ReactNode;
  background?: BackgroundLayer;
}> = ({ children, background }) => {
  const { mode } = useAppearance();

  React.useEffect(() => {
    injectClassNameToDocumentElement(mode, background);
  }, [mode, background]);

  return <Provider colorScheme={mode}>{children}</Provider>;
};
export default GlobalThemeProvider;
