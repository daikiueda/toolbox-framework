import { electronAPI } from '@electron-toolkit/preload';

import { TEMPLATE_CHANNELS, type TemplateAPI } from './constants';

export const buildTemplateAPI = (): TemplateAPI => {
  const { ipcRenderer } = electronAPI;

  return {
    greet: (who: string) => ipcRenderer.invoke(TEMPLATE_CHANNELS.greet, who),
  };
};
