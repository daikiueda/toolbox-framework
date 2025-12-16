import { electronAPI } from '@electron-toolkit/preload';

import { ORG_AND_LOGIN_USER_CHANNELS, type OrgAndLoginUserAPI } from './constants';

export const buildOrgAndLoginUserAPI = (): OrgAndLoginUserAPI => {
  const { ipcRenderer } = electronAPI;

  return {
    getOrgDetail: () => ipcRenderer.invoke(ORG_AND_LOGIN_USER_CHANNELS.getOrgDetail),
    getLoginUserDetail: () => ipcRenderer.invoke(ORG_AND_LOGIN_USER_CHANNELS.getLoginUserDetail),
    listRecentLoginHistory: () =>
      ipcRenderer.invoke(ORG_AND_LOGIN_USER_CHANNELS.listRecentLoginHistory),
  };
};
