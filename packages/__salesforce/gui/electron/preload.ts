import { electronAPI } from '@electron-toolkit/preload';

import { SALESFORCE_CHANNELS, type SalesforceAPI } from './constants';

export const buildSalesforceAPI = (): SalesforceAPI => {
  const { ipcRenderer } = electronAPI;

  return {
    loginWithOAuth: (instanceUrl: string) =>
      ipcRenderer.invoke(SALESFORCE_CHANNELS.loginWithOAuth, instanceUrl),
    loginWithSfdx: (instanceUrl: string) =>
      ipcRenderer.invoke(SALESFORCE_CHANNELS.loginWithSfdx, instanceUrl),
    loginWithAuthOrg: (usernameOrAlias: string) =>
      ipcRenderer.invoke(SALESFORCE_CHANNELS.loginWithAuthOrg, usernameOrAlias),
    getAuthenticatedOrgs: () => ipcRenderer.invoke(SALESFORCE_CHANNELS.getAuthenticatedOrgs),
    logout: () => ipcRenderer.invoke(SALESFORCE_CHANNELS.logout),
    getOrgInfo: () => ipcRenderer.invoke(SALESFORCE_CHANNELS.getOrgInfo),
    getConnectionState: () => ipcRenderer.invoke(SALESFORCE_CHANNELS.getConnectionState),
    isConnectedWithSfdx: () => ipcRenderer.invoke(SALESFORCE_CHANNELS.isConnectedWithSfdx),
  };
};
