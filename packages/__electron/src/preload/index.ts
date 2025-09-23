import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';

type ThemeSource = 'system' | 'light' | 'dark';

type AppearanceState = {
  themeSource: ThemeSource;
  shouldUseDarkColors: boolean;
  shouldUseHighContrastColors: boolean;
  shouldUseInvertedColorScheme: boolean;
};

const APPEARANCE_CHANNEL = 'appearance:changed';

const buildAppearanceAPI = () => {
  const { ipcRenderer } = electronAPI;

  const subscribe = (listener: (state: AppearanceState) => void) => {
    const handler = (_event: unknown, state: AppearanceState) => listener(state);
    ipcRenderer.on(APPEARANCE_CHANNEL, handler);
    return () => ipcRenderer.removeListener(APPEARANCE_CHANNEL, handler);
  };

  return {
    getState: () => ipcRenderer.invoke('appearance:get-state') as Promise<AppearanceState>,
    setThemeSource: (themeSource: ThemeSource) =>
      ipcRenderer.invoke('appearance:set-theme-source', themeSource),
    subscribe,
  };
};

// Custom APIs for renderer
const api = {
  appearance: buildAppearanceAPI(),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
