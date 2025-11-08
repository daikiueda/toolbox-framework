import type {
  ExportCompletionPayload,
  ExportProgressEvent,
  ExportProgressSnapshot,
  ObjectSelectionState,
} from '../../src/models';
import type { ResolvedOutputDirectory, StartExportResponse } from '../../src/usecases';

const PREFIX = 'multiple-bulk-export:';

export const MULTIPLE_BULK_EXPORT_CHANNELS = {
  validateObjectSelection: `${PREFIX}validate-object-selection`,
  startExport: `${PREFIX}start-export`,
  cancelExport: `${PREFIX}cancel-export`,
  chooseOutputDirectory: `${PREFIX}choose-output-directory`,
  getDefaultOutputDirectory: `${PREFIX}get-default-output-directory`,
  previewOutputDirectory: `${PREFIX}preview-output-directory`,
  getCurrentSnapshot: `${PREFIX}get-current-snapshot`,
  getLastCompletion: `${PREFIX}get-last-completion`,
  openPath: `${PREFIX}open-path`,
  progressEvent: `${PREFIX}progress-event`,
} as const;

export type MultipleBulkExportChannel =
  (typeof MULTIPLE_BULK_EXPORT_CHANNELS)[keyof typeof MULTIPLE_BULK_EXPORT_CHANNELS];

export type MultipleBulkExportAPI = {
  validateObjectSelection: (objects: string[]) => Promise<ObjectSelectionState>;
  startExport: (params: {
    objects: string[];
    outputDirectory?: string | null;
  }) => Promise<StartExportResponse>;
  cancelExport: () => Promise<boolean>;
  chooseOutputDirectory: (initialDirectory?: string | null) => Promise<string | null>;
  getDefaultOutputDirectory: () => Promise<ResolvedOutputDirectory>;
  previewOutputDirectory: (customBase?: string | null) => Promise<ResolvedOutputDirectory>;
  getCurrentSnapshot: () => Promise<ExportProgressSnapshot | null>;
  getLastCompletion: () => Promise<ExportCompletionPayload | null>;
  openPath: (targetPath: string) => Promise<boolean>;
  subscribeProgress: (handler: (event: ExportProgressEvent) => void) => () => void;
};
