import { ElectronAPI } from '@electron-toolkit/preload';

import type { AppearanceAPI } from '../__extensions/appearance/shared';
import type { PersistenceAPI } from '../__extensions/persistence/shared';

declare global {
  interface Window {
    electron: ElectronAPI;
    api?: {
      appearance?: AppearanceAPI;
      persistence?: PersistenceAPI;
    };
  }
}
