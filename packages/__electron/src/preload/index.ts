import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';

import { buildAppearanceAPI } from '../__extensions/appearance/preload';
import { buildBrowserWindowAPI } from '../__extensions/browserWindow/preload';
import { buildPersistenceAPI } from '../__extensions/persistence/preload';
import { buildSalesforceAPI } from '../__extensions/salesforce/preload';

// Custom APIs for renderer
const api = {
  appearance: buildAppearanceAPI(),
  persistence: buildPersistenceAPI(),
  browserWindow: buildBrowserWindowAPI(),
  salesforce: buildSalesforceAPI(),
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
  window.electron = electronAPI;
  window.api = api;
}
