export const APPEARANCE_CHANNELS = {
  changed: 'appearance:changed',
  getState: 'appearance:get-state',
  setThemeSource: 'appearance:set-theme-source',
} as const;

export type AppearanceChannel = (typeof APPEARANCE_CHANNELS)[keyof typeof APPEARANCE_CHANNELS];

export type ThemeSource = 'system' | 'light' | 'dark';

export type AppearanceState = {
  themeSource: ThemeSource;
  shouldUseDarkColors: boolean;
  shouldUseHighContrastColors: boolean;
  shouldUseInvertedColorScheme: boolean;
};

export type AppearanceAPI = {
  getState: () => Promise<AppearanceState>;
  setThemeSource: (themeSource: ThemeSource) => Promise<AppearanceState>;
  subscribe: (listener: (state: AppearanceState) => void) => () => void;
};
