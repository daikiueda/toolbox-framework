import { ipcMain } from 'electron';

import template from '../../src/main';

import { TEMPLATE_CHANNELS, TemplateChannel } from './constants';

const registerTemplateHandlers = () => {
  ipcMain.handle(TEMPLATE_CHANNELS.greet, (_event, who: string) => template(who));
};

const unregisterTemplateHandlers = () => {
  (Object.values(TEMPLATE_CHANNELS) as TemplateChannel[]).forEach((channel) => {
    if (ipcMain.listenerCount(channel) > 0) {
      ipcMain.removeHandler(channel);
    }
  });
};

export { registerTemplateHandlers, unregisterTemplateHandlers };
