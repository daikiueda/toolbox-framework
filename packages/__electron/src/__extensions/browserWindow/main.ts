import { BrowserWindow, ipcMain } from 'electron';

import rootPackageJson from '../../../../../package.json';

import { BROWSER_WINDOW_CHANNELS, type BrowserWindowChannel } from './constants';

const formatTitle = (title?: string) =>
  title ? `${rootPackageJson.name} - ${title}` : rootPackageJson.name;

const registerBrowserWindowHandlers = (window: BrowserWindow) => {
  const handleSetTitle: Parameters<typeof ipcMain.handle>[1] = (_event, title: string) => {
    if (window) window.setTitle(formatTitle(title));
  };

  ipcMain.handle(BROWSER_WINDOW_CHANNELS.setTitle, handleSetTitle);
};

const unregisterBrowserWindowHandlers = () => {
  (Object.values(BROWSER_WINDOW_CHANNELS) as BrowserWindowChannel[]).forEach((channel) => {
    if (ipcMain.listenerCount(channel) > 0) {
      ipcMain.removeHandler(channel);
    }
  });
};

export { registerBrowserWindowHandlers, unregisterBrowserWindowHandlers };
