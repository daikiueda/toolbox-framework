import { type MultipleBulkExportAPI } from '../electron';

type WorkspaceApiGetter = () => MultipleBulkExportAPI;

export const getWorkspaceApi: WorkspaceApiGetter = () => {
  const api = (window.api as unknown as { multipleBulkExport?: MultipleBulkExportAPI })
    ?.multipleBulkExport;

  if (!api) {
    throw new Error('[multipleBulkExport] preload API が利用できません');
  }

  return api;
};
