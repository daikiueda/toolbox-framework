import { ipcMain } from 'electron';

import { listRecentLoginHistory } from '../../src/LoginHistoryRecord';
import { getLoginUserDetail } from '../../src/LoginUserDetail';
import { getOrgDetail } from '../../src/OrgDetail';

import { ORG_AND_LOGIN_USER_CHANNELS, OrgAndLoginUserChannel } from './constants';

const registerOrgAndLoginUserHandlers = () => {
  ipcMain.handle(ORG_AND_LOGIN_USER_CHANNELS.getOrgDetail, getOrgDetail);
  ipcMain.handle(ORG_AND_LOGIN_USER_CHANNELS.getLoginUserDetail, getLoginUserDetail);
  ipcMain.handle(ORG_AND_LOGIN_USER_CHANNELS.listRecentLoginHistory, listRecentLoginHistory);
};

const unregisterOrgAndLoginUserHandlers = () => {
  (Object.values(ORG_AND_LOGIN_USER_CHANNELS) as OrgAndLoginUserChannel[]).forEach((channel) => {
    if (ipcMain.listenerCount(channel) > 0) {
      ipcMain.removeHandler(channel);
    }
  });
};

export { registerOrgAndLoginUserHandlers, unregisterOrgAndLoginUserHandlers };
