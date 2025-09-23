import { ElectronAPI } from '@electron-toolkit/preload';

type ThemeSource = 'system' | 'light' | 'dark';

type AppearanceState = {
  themeSource: ThemeSource;
  shouldUseDarkColors: boolean;
  shouldUseHighContrastColors: boolean;
  shouldUseInvertedColorScheme: boolean;
};

type AppearanceAPI = {
  getState: () => Promise<AppearanceState>;
  setThemeSource: (themeSource: ThemeSource) => Promise<AppearanceState>;
  subscribe: (listener: (state: AppearanceState) => void) => () => void;
};

declare global {
  interface Window {
    electron: ElectronAPI;
    api?: {
      appearance?: AppearanceAPI;
    };
  }
}
