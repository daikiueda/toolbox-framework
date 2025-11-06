import { BrowserWindow, type OpenDialogOptions, dialog, ipcMain, shell } from 'electron';

import type { ExportProgressEvent } from '../../src/models';
import { getOrgDetail } from '../../src/repositories/OrgDetailRepository';
import { exportController } from '../../src/usecases';

import { MULTIPLE_BULK_EXPORT_CHANNELS, MultipleBulkExportChannel } from './constants';

const forwardProgress = (event: ExportProgressEvent) => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(MULTIPLE_BULK_EXPORT_CHANNELS.progressEvent, event);
  });
};

const registerMultipleBulkExportHandlers = () => {
  ipcMain.handle(MULTIPLE_BULK_EXPORT_CHANNELS.getOrgDetail, getOrgDetail);

  ipcMain.handle(
    MULTIPLE_BULK_EXPORT_CHANNELS.validateObjectSelection,
    async (_event, objects: unknown) => {
      if (!Array.isArray(objects)) {
        throw new Error('配列のオブジェクト名を渡してください');
      }
      return exportController.validate(objects.map((item) => String(item)));
    }
  );

  ipcMain.handle(
    MULTIPLE_BULK_EXPORT_CHANNELS.startExport,
    async (_event, params: { objects?: unknown; outputDirectory?: unknown }) => {
      const objects = Array.isArray(params?.objects)
        ? params.objects.map((item) => String(item))
        : [];
      const outputDirectory =
        typeof params?.outputDirectory === 'string' ? params.outputDirectory : null;

      return exportController.start({
        objects,
        outputDirectory,
        emitter: forwardProgress,
      });
    }
  );

  ipcMain.handle(MULTIPLE_BULK_EXPORT_CHANNELS.cancelExport, async () => exportController.cancel());

  ipcMain.handle(MULTIPLE_BULK_EXPORT_CHANNELS.getCurrentSnapshot, async () =>
    exportController.getSnapshot()
  );

  ipcMain.handle(MULTIPLE_BULK_EXPORT_CHANNELS.getLastCompletion, async () =>
    exportController.getCompletion()
  );

  ipcMain.handle(MULTIPLE_BULK_EXPORT_CHANNELS.getDefaultOutputDirectory, async () =>
    exportController.getDefaultOutputDirectory()
  );

  ipcMain.handle(
    MULTIPLE_BULK_EXPORT_CHANNELS.previewOutputDirectory,
    async (_event, customBase?: unknown) =>
      exportController.previewOutputDirectory(
        typeof customBase === 'string' && customBase.length > 0 ? customBase : null
      )
  );

  ipcMain.handle(
    MULTIPLE_BULK_EXPORT_CHANNELS.chooseOutputDirectory,
    async (event, initialPath?: unknown) => {
      const browserWindow = BrowserWindow.fromWebContents(event.sender);
      const options: OpenDialogOptions = {
        title: '保存先ディレクトリを選択',
        properties: ['openDirectory', 'createDirectory'],
        defaultPath: typeof initialPath === 'string' ? initialPath : undefined,
      };

      const result = browserWindow
        ? await dialog.showOpenDialog(browserWindow, options)
        : await dialog.showOpenDialog(options);

      if (result.canceled || result.filePaths.length === 0) {
        return null;
      }

      return result.filePaths[0];
    }
  );

  ipcMain.handle(MULTIPLE_BULK_EXPORT_CHANNELS.openPath, async (_event, targetPath: unknown) => {
    if (typeof targetPath !== 'string' || targetPath.length === 0) {
      return false;
    }

    const result = await shell.openPath(targetPath);
    return result.length === 0;
  });
};

const unregisterMultipleBulkExportHandlers = () => {
  (Object.entries(MULTIPLE_BULK_EXPORT_CHANNELS) as [string, MultipleBulkExportChannel][]).forEach(
    ([key, channel]) => {
      if (key === 'progressEvent') {
        return;
      }

      if (ipcMain.listenerCount(channel) > 0) {
        ipcMain.removeHandler(channel);
      }
    }
  );
};

export { registerMultipleBulkExportHandlers, unregisterMultipleBulkExportHandlers };
