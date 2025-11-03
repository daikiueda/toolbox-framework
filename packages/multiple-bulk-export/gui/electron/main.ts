import { ipcMain } from 'electron';

import { getOrgDetail } from '../../src/repositories/OrgDetailRepository';

import { MULTIPLE_BULK_EXPORT_CHANNELS, MultipleBulkExportChannel } from './constants';

const registerMultipleBulkExportHandlers = () => {
  ipcMain.handle(MULTIPLE_BULK_EXPORT_CHANNELS.getOrgDetail, getOrgDetail);
};

const unregisterMultipleBulkExportHandlers = () => {
  (Object.values(MULTIPLE_BULK_EXPORT_CHANNELS) as MultipleBulkExportChannel[]).forEach(
    (channel) => {
      if (ipcMain.listenerCount(channel) > 0) {
        ipcMain.removeHandler(channel);
      }
    }
  );
};

export { registerMultipleBulkExportHandlers, unregisterMultipleBulkExportHandlers };
