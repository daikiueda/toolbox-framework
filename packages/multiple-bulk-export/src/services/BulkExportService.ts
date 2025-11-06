import { createWriteStream } from 'fs';
import { mkdir, unlink } from 'fs/promises';
import path from 'path';

import type { DescribeSObjectResult, Schema } from 'jsforce';
import { type QueryJobInfoV2, QueryJobV2 } from 'jsforce/lib/api/bulk2';
import { pipeline } from 'stream/promises';
import { setTimeout as delay } from 'timers/promises';

import { SalesforceConnection } from '@toolbox/salesforce/lib';

import type {
  ExportCompletionPayload,
  ExportLifecycleState,
  ExportLogEntry,
  ExportProgressEvent,
  ExportProgressSnapshot,
  ExportSummary,
  NormalizedObject,
  ObjectExportProgress,
  StartExportOptions,
} from '../models';
import { describeSObject } from '../repositories/MetadataRepository';

const DEFAULT_CONCURRENCY = Number.parseInt(
  process.env.MULTIPLE_BULK_EXPORT_MAX_CONCURRENCY ?? '5',
  10
);

const POLL_INTERVAL_MS = Number.parseInt(
  process.env.MULTIPLE_BULK_EXPORT_POLL_INTERVAL_MS ?? '5000',
  10
);

const POLL_TIMEOUT_MS = Number.parseInt(
  process.env.MULTIPLE_BULK_EXPORT_POLL_TIMEOUT_MS ?? `${30 * 60 * 1000}`,
  10
);

const MAX_RETRY = Number.parseInt(process.env.MULTIPLE_BULK_EXPORT_MAX_RETRY ?? '3', 10);

const BACKOFF_BASE_MS = Number.parseInt(
  process.env.MULTIPLE_BULK_EXPORT_RETRY_BASE_MS ?? '2000',
  10
);

type ProgressEmitter = (event: ExportProgressEvent) => void;

type BulkExportServiceOptions = StartExportOptions & {
  normalizedObjects: NormalizedObject[];
  emitter: ProgressEmitter;
};

const nowISO = () => new Date().toISOString();

const extractNumberRecordsTotal = (info: QueryJobInfoV2): number | null => {
  const total = (info as QueryJobInfoV2 & { numberRecordsTotal?: number }).numberRecordsTotal;
  return typeof total === 'number' ? total : null;
};

export class BulkExportService {
  private readonly normalizedObjects: NormalizedObject[];

  private readonly outputDirectory: string;

  private readonly emitter: ProgressEmitter;

  private readonly maxConcurrency: number;

  private readonly retryLimit: number;

  private lifecycle: ExportLifecycleState = 'idle';

  private readonly objectStates = new Map<string, ObjectExportProgress>();

  private readonly logs: ExportLogEntry[] = [];

  private readonly successFiles: string[] = [];

  private readonly activeJobs = new Map<string, QueryJobV2<Schema>>();

  private cancelled = false;

  private startedAt: string | undefined;

  private finishedAt: string | undefined;

  constructor(options: BulkExportServiceOptions) {
    this.normalizedObjects = options.normalizedObjects;
    this.outputDirectory = options.outputDirectory ?? '';
    this.emitter = options.emitter;
    this.maxConcurrency = Math.max(1, Number.isNaN(DEFAULT_CONCURRENCY) ? 5 : DEFAULT_CONCURRENCY);
    this.retryLimit = Math.max(1, Number.isNaN(MAX_RETRY) ? 3 : MAX_RETRY);

    this.normalizedObjects.forEach((obj) => {
      this.objectStates.set(obj.apiName, {
        objectName: obj.apiName,
        label: obj.label,
        status: 'pending',
        processedRecords: 0,
        totalRecords: null,
        outputPath: null,
      });
    });
  }

  execute = async (): Promise<ExportCompletionPayload> => {
    this.startedAt = nowISO();
    await mkdir(this.outputDirectory, { recursive: true });

    this.updateLifecycle('running');

    await this.runWithConcurrency();

    this.finishedAt = nowISO();

    if (this.cancelled) {
      this.updateLifecycle('cancelled');
    } else if (this.hasFailures()) {
      this.updateLifecycle('failed');
    } else {
      this.updateLifecycle('completed');
    }

    const completion: ExportCompletionPayload = {
      summary: this.computeSummary(),
      outputDirectory: this.outputDirectory,
      files: [...this.successFiles],
      finishedAt: this.finishedAt,
      errors: this.getFailureReasons(),
    };

    return completion;
  };

  cancel = async (): Promise<void> => {
    this.cancelled = true;
    await Promise.all(
      [...this.activeJobs.entries()].map(async ([objectName, job]) => {
        try {
          await job.abort();
          this.appendLog('warn', `ジョブをキャンセルしました`, objectName);
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          this.appendLog('error', `ジョブのキャンセルに失敗しました: ${reason}`, objectName);
        }
      })
    );

    for (const state of this.objectStates.values()) {
      if (state.status === 'pending' || state.status === 'running') {
        this.markCancelled(state);
      }
    }
  };

  getSnapshot = (): ExportProgressSnapshot => ({
    lifecycle: this.lifecycle,
    summary: this.computeSummary(),
    objects: [...this.objectStates.values()],
    logs: [...this.logs],
    outputDirectory: this.outputDirectory,
    startedAt: this.startedAt,
    finishedAt: this.finishedAt,
  });

  private runWithConcurrency = async (): Promise<void> => {
    let cursor = 0;
    const limit = Math.min(this.maxConcurrency, this.normalizedObjects.length);

    const workers = Array.from({ length: limit || 1 }, () => this.worker(() => cursor++));

    await Promise.all(workers);
  };

  private worker = (nextIndex: () => number): Promise<void> => {
    const iterate = async (): Promise<void> => {
      if (this.cancelled) {
        return;
      }

      const index = nextIndex();
      const target = this.normalizedObjects[index];

      if (!target) {
        return;
      }

      await this.exportSingleObject(target);

      await iterate();
    };

    return iterate();
  };

  private exportSingleObject = async (target: NormalizedObject): Promise<void> => {
    const state = this.objectStates.get(target.apiName);
    if (!state) {
      return;
    }

    if (this.cancelled) {
      this.markCancelled(state);
      return;
    }

    this.markRunning(state);

    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < this.retryLimit && !this.cancelled) {
      attempt += 1;
      this.appendLog(
        'info',
        `エクスポートを開始します (試行 ${attempt}/${this.retryLimit})`,
        target.apiName
      );
      try {
        const describe = await describeSObject(target.apiName);

        const result = await this.executeQueryJob(target, describe);

        state.status = 'succeeded';
        state.finishedAt = nowISO();
        state.outputPath = result.outputPath;
        state.processedRecords = result.numberRecordsProcessed;
        state.totalRecords = result.numberRecordsTotal;

        this.successFiles.push(result.outputPath);

        this.appendLog(
          'info',
          `エクスポート完了: ${result.numberRecordsProcessed.toLocaleString()} 件`,
          target.apiName
        );

        this.emitObjectProgress(state);
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.appendLog(
          'error',
          `エクスポート失敗 (試行 ${attempt}/${this.retryLimit}): ${lastError.message}`,
          target.apiName
        );

        if (attempt < this.retryLimit) {
          const backoff = BACKOFF_BASE_MS * 2 ** (attempt - 1);
          await delay(backoff);
        }
      }
    }

    if (this.cancelled) {
      this.markCancelled(state);
      return;
    }

    state.status = 'failed';
    state.finishedAt = nowISO();
    state.error = lastError ? lastError.message : '不明なエラーが発生しました。';
    this.emitObjectProgress(state);
  };

  private executeQueryJob = async (
    target: NormalizedObject,
    describe: DescribeSObjectResult
  ): Promise<{
    outputPath: string;
    numberRecordsProcessed: number;
    numberRecordsTotal: number | null;
  }> => {
    const conn = SalesforceConnection.getConnection();
    const { fieldNames, skippedFields } = this.getSelectableFieldNames(describe);

    if (fieldNames.length === 0) {
      throw new Error(`${target.apiName} にクエリ可能なフィールドが見つかりませんでした。`);
    }

    if (skippedFields.length > 0) {
      this.appendLog(
        'warn',
        `Bulk API で未対応の複合項目を除外しました: ${skippedFields.join(', ')}`,
        target.apiName
      );
    }

    const soql = this.buildSoql(target.apiName, fieldNames);

    const job = new QueryJobV2<Schema>(conn, {
      bodyParams: {
        query: soql,
        operation: 'query',
      },
      pollingOptions: conn.bulk2,
    });

    const state = this.objectStates.get(target.apiName);
    if (!state) {
      throw new Error('内部状態が見つかりません');
    }

    const handleInProgress = (info: QueryJobInfoV2) => {
      state.processedRecords = info.numberRecordsProcessed;
      state.totalRecords = extractNumberRecordsTotal(info);
      this.emitObjectProgress(state);
    };

    job.on('inProgress', handleInProgress);
    job.on('jobComplete', handleInProgress);

    this.activeJobs.set(target.apiName, job);

    try {
      await job.open();
      await job.poll(POLL_INTERVAL_MS, POLL_TIMEOUT_MS);

      const info = job.getInfo();
      state.processedRecords = info.numberRecordsProcessed;
      state.totalRecords = extractNumberRecordsTotal(info);
      this.emitObjectProgress(state);

      const outputPath = path.join(this.outputDirectory, `${target.apiName}.csv`);
      await this.writeResultToFile(job, outputPath);

      return {
        outputPath,
        numberRecordsProcessed: info.numberRecordsProcessed,
        numberRecordsTotal: extractNumberRecordsTotal(info),
      };
    } finally {
      this.activeJobs.delete(target.apiName);
      job.removeListener('inProgress', handleInProgress);
      job.removeListener('jobComplete', handleInProgress);
    }
  };

  private writeResultToFile = async (
    job: QueryJobV2<Schema>,
    outputPath: string
  ): Promise<void> => {
    const resultStream = await job.result();
    const csvStream = resultStream.stream('csv');
    const writable = createWriteStream(outputPath, { encoding: 'utf-8' });

    try {
      await pipeline(csvStream, writable);
    } catch (error) {
      await unlink(outputPath).catch(() => undefined);
      throw error;
    }
  };

  private buildSoql = (objectName: string, fieldNames: string[]): string => {
    if (fieldNames.length === 0) {
      throw new Error(`${objectName} にエクスポート可能なフィールドがありません。`);
    }

    return `SELECT ${fieldNames.join(', ')} FROM ${objectName}`;
  };

  private getSelectableFieldNames = (describe: DescribeSObjectResult) => {
    const compoundFieldTypes = new Set(['address', 'location']);

    const isUnsupportedCompound = (type: string | undefined) =>
      type ? compoundFieldTypes.has(type.toLowerCase()) : false;

    const selectableFields = describe.fields.filter((field) => !isUnsupportedCompound(field.type));
    const skippedFields = describe.fields
      .filter((field) => isUnsupportedCompound(field.type))
      .map((field) => field.name);

    return {
      fieldNames: selectableFields.map((field) => field.name),
      skippedFields,
    };
  };

  private updateLifecycle = (lifecycle: ExportLifecycleState) => {
    this.lifecycle = lifecycle;
    this.emitter({
      type: 'lifecycle',
      payload: {
        lifecycle,
        summary: this.computeSummary(),
        startedAt: this.startedAt,
        finishedAt: this.finishedAt,
      },
    });

    this.emitSnapshot();
  };

  private computeSummary = (): ExportSummary => {
    let completed = 0;
    let failed = 0;
    let cancelled = 0;
    let running = 0;

    for (const state of this.objectStates.values()) {
      switch (state.status) {
        case 'succeeded':
          completed += 1;
          break;
        case 'failed':
          failed += 1;
          break;
        case 'cancelled':
          cancelled += 1;
          break;
        case 'running':
          running += 1;
          break;
        default:
          break;
      }
    }

    return {
      total: this.objectStates.size,
      completed,
      failed,
      cancelled,
      running,
    };
  };

  private hasFailures = () =>
    [...this.objectStates.values()].some((state) => state.status === 'failed');

  private getFailureReasons = () =>
    [...this.objectStates.values()]
      .filter((state) => state.status === 'failed' && state.error)
      .map((state) => ({
        objectName: state.objectName,
        message: state.error ?? '不明なエラー',
      }));

  private markRunning = (state: ObjectExportProgress) => {
    state.status = 'running';
    state.startedAt = state.startedAt ?? nowISO();
    this.emitObjectProgress(state);
  };

  private markCancelled = (state: ObjectExportProgress) => {
    state.status = 'cancelled';
    state.finishedAt = nowISO();
    this.emitObjectProgress(state);
  };

  private emitObjectProgress = (state: ObjectExportProgress) => {
    this.emitter({
      type: 'object-progress',
      payload: {
        progress: { ...state },
        summary: this.computeSummary(),
      },
    });
  };

  private emitSnapshot = () => {
    this.emitter({
      type: 'snapshot',
      payload: this.getSnapshot(),
    });
  };

  private appendLog = (level: ExportLogEntry['level'], message: string, objectName?: string) => {
    const entry: ExportLogEntry = {
      level,
      message,
      objectName,
      timestamp: nowISO(),
    };
    this.logs.push(entry);
    this.emitter({ type: 'log', payload: entry });
  };
}

export const createBulkExportService = (options: BulkExportServiceOptions): BulkExportService =>
  new BulkExportService(options);
