import { electronAPI } from '@electron-toolkit/preload';

import { SALESFORCE_CHANNELS, type SalesforceAPI } from './constants';

export const buildSalesforceAPI = (): SalesforceAPI => {
  const { ipcRenderer } = electronAPI;

  return {
    login: (instanceUrl: string) => ipcRenderer.invoke(SALESFORCE_CHANNELS.login, instanceUrl),
    loginWithSfdx: (instanceUrl?: string) =>
      ipcRenderer.invoke(SALESFORCE_CHANNELS.loginWithSfdx, instanceUrl),
    logout: () => ipcRenderer.invoke(SALESFORCE_CHANNELS.logout),
    getOrgInfo: () => ipcRenderer.invoke(SALESFORCE_CHANNELS.getOrgInfo),
    getConnectionState: () => ipcRenderer.invoke(SALESFORCE_CHANNELS.getConnectionState),
    isConnectedWithSfdx: () => ipcRenderer.invoke(SALESFORCE_CHANNELS.isConnectedWithSfdx),
  };
};
