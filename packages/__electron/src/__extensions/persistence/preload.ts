import { electronAPI } from '@electron-toolkit/preload';

import { PERSISTENCE_CHANNELS, type PersistenceAPI } from './shared';

const buildPersistenceAPI = (): PersistenceAPI => {
  const { ipcRenderer } = electronAPI;

  return {
    read: (scope: string) => ipcRenderer.invoke(PERSISTENCE_CHANNELS.read, scope),
    write: (scope: string, value: unknown) =>
      ipcRenderer.invoke(PERSISTENCE_CHANNELS.write, scope, value),
    delete: (scope: string) => ipcRenderer.invoke(PERSISTENCE_CHANNELS.delete, scope),
  };
};

export { buildPersistenceAPI };
