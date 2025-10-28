import { electronAPI } from '@electron-toolkit/preload';

import { BROWSER_WINDOW_CHANNELS, type BrowserWindowAPI } from './constants';

const buildBrowserWindowAPI = (): BrowserWindowAPI => {
  const { ipcRenderer } = electronAPI;

  return {
    setTitle: () => ipcRenderer.invoke(BROWSER_WINDOW_CHANNELS.setTitle) as Promise<void>,
  };
};

export { buildBrowserWindowAPI };
