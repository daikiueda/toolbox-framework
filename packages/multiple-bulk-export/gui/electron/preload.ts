import { electronAPI } from '@electron-toolkit/preload';

import { MULTIPLE_BULK_EXPORT_CHANNELS, type MultipleBulkExportAPI } from './constants';

export const buildMultipleBulkExportAPI = (): MultipleBulkExportAPI => {
  const { ipcRenderer } = electronAPI;

  return {
    getOrgDetail: () => ipcRenderer.invoke(MULTIPLE_BULK_EXPORT_CHANNELS.getOrgDetail),
  };
};
