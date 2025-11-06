export type ObjectExportStatus = 'pending' | 'running' | 'succeeded' | 'failed' | 'cancelled';

export type ObjectExportProgress = {
  objectName: string;
  label: string;
  status: ObjectExportStatus;
  startedAt?: string;
  finishedAt?: string;
  outputPath?: string | null;
  processedRecords: number;
  totalRecords?: number | null;
  error?: string | null;
};

export type ExportSummary = {
  total: number;
  completed: number;
  failed: number;
  cancelled: number;
  running: number;
};

export type ExportLogEntry = {
  level: 'info' | 'warn' | 'error';
  message: string;
  objectName?: string;
  timestamp: string;
};

export type ExportLifecycleState = 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';

export type ExportProgressSnapshot = {
  lifecycle: ExportLifecycleState;
  summary: ExportSummary;
  objects: ObjectExportProgress[];
  logs: ExportLogEntry[];
  outputDirectory: string | null;
  startedAt?: string;
  finishedAt?: string;
};

export type ExportProgressEvent =
  | {
      type: 'snapshot';
      payload: ExportProgressSnapshot;
    }
  | {
      type: 'object-progress';
      payload: {
        progress: ObjectExportProgress;
        summary: ExportSummary;
      };
    }
  | {
      type: 'log';
      payload: ExportLogEntry;
    }
  | {
      type: 'lifecycle';
      payload: Pick<ExportProgressSnapshot, 'lifecycle' | 'summary' | 'startedAt' | 'finishedAt'>;
    }
  | {
      type: 'completion';
      payload: ExportCompletionPayload;
    };

export type ExportErrorDetail = {
  objectName: string;
  message: string;
};

export type ExportCompletionPayload = {
  summary: ExportSummary;
  outputDirectory: string | null;
  files: string[];
  finishedAt: string;
  errors: ExportErrorDetail[];
};

export type StartExportOptions = {
  objects: string[];
  outputDirectory?: string | null;
};
