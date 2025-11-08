import { electronAPI } from '@electron-toolkit/preload';

import type { ExportProgressEvent } from '../../src/models';

import { MULTIPLE_BULK_EXPORT_CHANNELS, type MultipleBulkExportAPI } from './constants';

export const buildMultipleBulkExportAPI = (): MultipleBulkExportAPI => {
  const { ipcRenderer } = electronAPI;

  return {
    validateObjectSelection: (objects: string[]) =>
      ipcRenderer.invoke(MULTIPLE_BULK_EXPORT_CHANNELS.validateObjectSelection, objects),
    startExport: (params) => ipcRenderer.invoke(MULTIPLE_BULK_EXPORT_CHANNELS.startExport, params),
    cancelExport: () => ipcRenderer.invoke(MULTIPLE_BULK_EXPORT_CHANNELS.cancelExport),
    chooseOutputDirectory: (initialDirectory) =>
      ipcRenderer.invoke(
        MULTIPLE_BULK_EXPORT_CHANNELS.chooseOutputDirectory,
        initialDirectory ?? null
      ),
    getDefaultOutputDirectory: () =>
      ipcRenderer.invoke(MULTIPLE_BULK_EXPORT_CHANNELS.getDefaultOutputDirectory),
    previewOutputDirectory: (customBase?: string | null) =>
      ipcRenderer.invoke(MULTIPLE_BULK_EXPORT_CHANNELS.previewOutputDirectory, customBase ?? null),
    getCurrentSnapshot: () => ipcRenderer.invoke(MULTIPLE_BULK_EXPORT_CHANNELS.getCurrentSnapshot),
    getLastCompletion: () => ipcRenderer.invoke(MULTIPLE_BULK_EXPORT_CHANNELS.getLastCompletion),
    openPath: (targetPath: string) =>
      ipcRenderer.invoke(MULTIPLE_BULK_EXPORT_CHANNELS.openPath, targetPath),
    subscribeProgress: (handler) => {
      const listener = (_event: unknown, payload: ExportProgressEvent) => handler(payload);
      ipcRenderer.on(MULTIPLE_BULK_EXPORT_CHANNELS.progressEvent, listener);
      return () =>
        ipcRenderer.removeListener(MULTIPLE_BULK_EXPORT_CHANNELS.progressEvent, listener);
    },
  };
};
