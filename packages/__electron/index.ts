import type { AppearanceAPI } from './src/__extensions/appearance/shared';
import type { PersistenceAPI } from './src/__extensions/persistence/shared';

type GlobalAPI = {
  appearance: AppearanceAPI;
  persistence: PersistenceAPI;
};

/**
 * for Client App
 */
export const getGlobalAPI = (): GlobalAPI | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return (window as typeof window & { api: GlobalAPI }).api;
};
