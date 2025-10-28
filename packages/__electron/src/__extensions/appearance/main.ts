import { BrowserWindow, ipcMain, nativeTheme } from 'electron';

import {
  APPEARANCE_CHANNELS,
  type AppearanceChannel,
  type AppearanceState,
  type ThemeSource,
} from './constants';

const getAppearanceState = (): AppearanceState => ({
  themeSource: nativeTheme.themeSource,
  shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
  shouldUseHighContrastColors: nativeTheme.shouldUseHighContrastColors,
  shouldUseInvertedColorScheme: nativeTheme.shouldUseInvertedColorScheme,
});

const broadcastAppearanceState = () => {
  const state = getAppearanceState();
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(APPEARANCE_CHANNELS.changed, state);
  });
};

const isValidThemeSource = (value: unknown): value is ThemeSource => {
  return value === 'system' || value === 'light' || value === 'dark';
};

let nativeThemeListener: (() => void) | undefined;

const registerAppearanceHandlers = () => {
  const handleGetState: Parameters<typeof ipcMain.handle>[1] = () => getAppearanceState();

  const handleSetThemeSource: Parameters<typeof ipcMain.handle>[1] = (
    _event,
    themeSource: unknown
  ) => {
    if (isValidThemeSource(themeSource)) {
      nativeTheme.themeSource = themeSource;
      broadcastAppearanceState();
      return getAppearanceState();
    }

    return getAppearanceState();
  };

  ipcMain.handle(APPEARANCE_CHANNELS.getState, handleGetState);
  ipcMain.handle(APPEARANCE_CHANNELS.setThemeSource, handleSetThemeSource);

  const handleNativeThemeUpdated = () => {
    broadcastAppearanceState();
  };

  nativeTheme.on('updated', handleNativeThemeUpdated);
  nativeThemeListener = () => {
    nativeTheme.removeListener('updated', handleNativeThemeUpdated);
  };
};

const unregisterAppearanceHandlers = () => {
  (Object.values(APPEARANCE_CHANNELS) as AppearanceChannel[]).forEach((channel) => {
    if (channel === APPEARANCE_CHANNELS.changed) {
      return;
    }
    if (ipcMain.listenerCount(channel) > 0) {
      ipcMain.removeHandler(channel);
    }
  });

  nativeThemeListener?.();
  nativeThemeListener = undefined;
};

export { registerAppearanceHandlers, unregisterAppearanceHandlers };
