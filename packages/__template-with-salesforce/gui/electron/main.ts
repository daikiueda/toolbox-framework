import { ipcMain } from 'electron';

import { getOrgDetail } from '../../src/repositories/OrgDetailRepository';

import { TEMPLATE_CHANNELS, TemplateChannel } from './constants';

const registerTemplateHandlers = () => {
  ipcMain.handle(TEMPLATE_CHANNELS.getOrgDetail, getOrgDetail);
};

const unregisterTemplateHandlers = () => {
  (Object.values(TEMPLATE_CHANNELS) as TemplateChannel[]).forEach((channel) => {
    if (ipcMain.listenerCount(channel) > 0) {
      ipcMain.removeHandler(channel);
    }
  });
};

export { registerTemplateHandlers, unregisterTemplateHandlers };
