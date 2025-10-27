import { ElectronAPI } from '@electron-toolkit/preload';

import { OrgAndLoginUserAPI } from '@toolbox/org-and-login-user/electron';
import { SalesforceAPI } from '@toolbox/salesforce/electron';

import type { AppearanceAPI } from '../__extensions/appearance/constants';
import type { BrowserWindowAPI } from '../__extensions/browserWindow/constants';
import type { PersistenceAPI } from '../__extensions/persistence/constants';

declare global {
  interface Window {
    electron: ElectronAPI;
    api?: {
      appearance?: AppearanceAPI;
      persistence?: PersistenceAPI;
      browserWindowAPI?: BrowserWindowAPI;
      salesforce?: SalesforceAPI;
      orgAndLoginUser?: OrgAndLoginUserAPI;
    };
  }
}
