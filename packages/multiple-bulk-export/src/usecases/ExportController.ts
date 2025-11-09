import path from 'path';

import { app } from 'electron';

import { SalesforceConnection } from '@toolbox/salesforce/lib';

import type {
  ExportCompletionPayload,
  ExportProgressEvent,
  ExportProgressSnapshot,
  NormalizedObject,
  ObjectSelectionState,
} from '../models';
import { BulkExportService, createBulkExportService } from '../services/BulkExportService';
import { validateObjectSelection } from '../services/ObjectSelectionService';
import { formatOrgInfo, formatTimestamp } from '../utils/path';

type ProgressEmitter = (event: ExportProgressEvent) => void;

type StartExportRequest = {
  objects: string[];
  outputDirectory?: string | null;
  emitter: ProgressEmitter;
};

type StartExportResponse = {
  snapshot: ExportProgressSnapshot;
  warnings: ObjectSelectionState['result']['warnings'];
  normalizedObjects: NormalizedObject[];
  outputDirectory: string;
};

type ResolvedOutputDirectory = {
  fullPath: string;
  orgName: string;
  timestamp: string;
};

const broadcastError = (emitter: ProgressEmitter, message: string) => {
  emitter({
    type: 'log',
    payload: {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
    },
  });
};

class ExportController {
  private currentService: BulkExportService | null = null;

  private lastSnapshot: ExportProgressSnapshot | null = null;

  private lastCompletion: ExportCompletionPayload | null = null;

  validate = async (rawValues: string[]): Promise<ObjectSelectionState> => {
    const result = await validateObjectSelection(rawValues);
    return result;
  };

  start = async ({
    objects,
    outputDirectory,
    emitter,
  }: StartExportRequest): Promise<StartExportResponse> => {
    if (this.currentService) {
      throw new Error('エクスポートは既に実行中です。');
    }

    const validation = await this.validate(objects);

    if (validation.result.errors.length > 0) {
      throw new Error('入力エラーを解消してから実行してください。');
    }

    if (validation.result.normalizedObjects.length === 0) {
      throw new Error('エクスポート対象がありません。');
    }

    const resolvedDir = await this.resolveOutputDirectory(outputDirectory);

    const forwardEmitter: ProgressEmitter = (event) => {
      if (event.type === 'snapshot') {
        this.lastSnapshot = event.payload;
      }
      emitter(event);
    };

    const service = createBulkExportService({
      objects: validation.result.normalizedObjects.map((obj) => obj.apiName),
      outputDirectory: resolvedDir.fullPath,
      normalizedObjects: validation.result.normalizedObjects,
      emitter: forwardEmitter,
    });

    this.currentService = service;
    this.lastSnapshot = service.getSnapshot();

    emitter({ type: 'snapshot', payload: this.lastSnapshot });

    service
      .execute()
      .then((completion) => {
        this.lastCompletion = completion;
        this.lastSnapshot = service.getSnapshot();
        emitter({ type: 'snapshot', payload: this.lastSnapshot });
        emitter({ type: 'completion', payload: completion });
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        broadcastError(emitter, `エクスポート処理で例外が発生しました: ${message}`);
      })
      .finally(() => {
        this.currentService = null;
      });

    return {
      snapshot: this.lastSnapshot,
      warnings: validation.result.warnings,
      normalizedObjects: validation.result.normalizedObjects,
      outputDirectory: resolvedDir.fullPath,
    };
  };

  cancel = async (): Promise<boolean> => {
    if (!this.currentService) {
      return false;
    }

    await this.currentService.cancel();
    return true;
  };

  getSnapshot = (): ExportProgressSnapshot | null => {
    if (this.currentService) {
      return this.currentService.getSnapshot();
    }
    return this.lastSnapshot;
  };

  getCompletion = (): ExportCompletionPayload | null => this.lastCompletion;

  isRunning = (): boolean => Boolean(this.currentService);

  resolveOutputDirectory = async (customBase?: string | null): Promise<ResolvedOutputDirectory> => {
    const org = await SalesforceConnection.getOrgInfo();
    const formattedOrgInfo = formatOrgInfo(org);
    const timestamp = formatTimestamp(new Date());

    const baseDirectory = customBase && customBase.trim().length > 0 ? customBase.trim() : null;

    const fullPath = baseDirectory
      ? path.join(baseDirectory, formattedOrgInfo, timestamp)
      : path.join(app.getPath('documents'), 'exports', formattedOrgInfo, timestamp);

    return {
      fullPath,
      orgName: formattedOrgInfo,
      timestamp,
    };
  };

  getDefaultOutputDirectory = async (): Promise<ResolvedOutputDirectory> =>
    this.resolveOutputDirectory(null);

  previewOutputDirectory = async (customBase?: string | null): Promise<ResolvedOutputDirectory> =>
    this.resolveOutputDirectory(customBase ?? null);
}

export const exportController = new ExportController();

export type { StartExportResponse, ResolvedOutputDirectory };
