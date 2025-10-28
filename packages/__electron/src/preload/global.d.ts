import { ElectronAPI } from '@electron-toolkit/preload';

import type { AppearanceAPI } from '../__extensions/appearance/constants';
import type { BrowserWindowAPI } from '../__extensions/browserWindow/constants';
import type { PersistenceAPI } from '../__extensions/persistence/constants';
import type { SalesforceAPI } from '../__extensions/salesforce/shared';

declare global {
  interface Window {
    electron: ElectronAPI;
    api?: {
      appearance?: AppearanceAPI;
      persistence?: PersistenceAPI;
      browserWindowAPI?: BrowserWindowAPI;
      salesforce?: SalesforceAPI;
    };
  }
}
