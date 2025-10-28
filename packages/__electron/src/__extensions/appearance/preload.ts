import { electronAPI } from '@electron-toolkit/preload';

import {
  APPEARANCE_CHANNELS,
  type AppearanceAPI,
  type AppearanceState,
  type ThemeSource,
} from './constants';

const buildAppearanceAPI = (): AppearanceAPI => {
  const { ipcRenderer } = electronAPI;

  const subscribe: AppearanceAPI['subscribe'] = (listener) => {
    const handler = (_event: unknown, state: AppearanceState) => listener(state);
    ipcRenderer.on(APPEARANCE_CHANNELS.changed, handler);
    return () => ipcRenderer.removeListener(APPEARANCE_CHANNELS.changed, handler);
  };

  return {
    getState: () => ipcRenderer.invoke(APPEARANCE_CHANNELS.getState) as Promise<AppearanceState>,
    setThemeSource: (themeSource: ThemeSource) =>
      ipcRenderer.invoke(APPEARANCE_CHANNELS.setThemeSource, themeSource),
    subscribe,
  };
};

export { buildAppearanceAPI };
