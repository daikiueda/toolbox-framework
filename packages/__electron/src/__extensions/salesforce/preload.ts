import { electronAPI } from '@electron-toolkit/preload';

import { SALESFORCE_CHANNELS, type SalesforceAPI } from './shared';

export const buildSalesforceAPI = (): SalesforceAPI => {
  const { ipcRenderer } = electronAPI;

  return {
    login: (instanceUrl: string) => ipcRenderer.invoke(SALESFORCE_CHANNELS.login, instanceUrl),
    logout: () => ipcRenderer.invoke(SALESFORCE_CHANNELS.logout),
    getOrgInfo: () => ipcRenderer.invoke(SALESFORCE_CHANNELS.getOrgInfo),
    getConnectionState: () => ipcRenderer.invoke(SALESFORCE_CHANNELS.getConnectionState),
  };
};
