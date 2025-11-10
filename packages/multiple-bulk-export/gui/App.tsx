import React, { useCallback, useEffect, useMemo, useState } from 'react';

import AppIcon from '@spectrum-icons/workflow/Organisations';

import {
  ActionButton,
  Badge,
  Button,
  Cell,
  Column,
  Content,
  Divider,
  Flex,
  Heading,
  InlineError,
  ProgressBar,
  Row,
  TableBody,
  TableHeader,
  TableView,
  Text,
  TextArea,
  View,
  Well,
  useSetting,
} from '@toolbox/design-system';
import { useSalesforce } from '@toolbox/salesforce';

import type {
  ExportCompletionPayload,
  ExportLogEntry,
  ExportProgressSnapshot,
  ObjectSelectionState,
} from '../src/models';
import { formatTimestamp } from '../src/utils/path';

import { Setting } from './Setting';
import PageWithTheme from './components/PageWithTheme';
import SettingsDialog from './components/SettingsDialog';
import { getWorkspaceApi } from './utils/getWorkspaceApi';

const LOG_HISTORY_LIMIT = 200;

const numberFormatter = new Intl.NumberFormat('ja-JP');

const toDisplayNumber = (value: number | null | undefined): string =>
  typeof value === 'number' && Number.isFinite(value) ? numberFormatter.format(value) : '-';

const parseObjectInput = (value: string): string[] =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const getStatusBadge = (
  status: string
): { label: string; variant: React.ComponentProps<typeof Badge>['variant'] } => {
  switch (status) {
    case 'running':
      return { label: '実行中', variant: 'indigo' };
    case 'succeeded':
      return { label: '完了', variant: 'positive' };
    case 'failed':
      return { label: '失敗', variant: 'negative' };
    case 'cancelled':
      return { label: 'キャンセル済み', variant: 'neutral' };
    default:
      return { label: '待機中', variant: 'info' };
  }
};

const App: React.FC = () => {
  const { LoginGate } = useSalesforce();
  const workspaceApi = useMemo(getWorkspaceApi, []);
  const [settings, updateSetting] = useSetting<Setting>(Setting.default(), {
    persistence: Setting.persistence,
  });

  const [validationState, setValidationState] = useState<ObjectSelectionState | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [snapshot, setSnapshot] = useState<ExportProgressSnapshot | null>(null);
  const [completion, setCompletion] = useState<ExportCompletionPayload | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const [defaultDirectory, setDefaultDirectory] = useState<string | null>(null);
  const [directoryPreview, setDirectoryPreview] = useState<string | null>(null);
  const [customDirectory, setCustomDirectory] = useState<string | null>(null);

  const [isLoadingDefaults, setIsLoadingDefaults] = useState(true);

  useEffect(() => {
    if (settings.outputDirectory) {
      setCustomDirectory(settings.outputDirectory);
    }
  }, [settings.outputDirectory]);

  useEffect(() => {
    let isActive = true;

    const initialize = async () => {
      try {
        const [defaultDir, currentSnapshot, lastCompletion] = await Promise.all([
          workspaceApi.getDefaultOutputDirectory().catch(() => null),
          workspaceApi.getCurrentSnapshot().catch(() => null),
          workspaceApi.getLastCompletion().catch(() => null),
        ]);

        if (!isActive) {
          return;
        }

        if (defaultDir) {
          setDefaultDirectory(defaultDir.fullPath);
          setDirectoryPreview(defaultDir.fullPath);
        }

        if (currentSnapshot) {
          setSnapshot(currentSnapshot);
          setDirectoryPreview(currentSnapshot.outputDirectory ?? defaultDir?.fullPath ?? null);
        }

        if (lastCompletion) {
          setCompletion(lastCompletion);
        }
      } finally {
        if (isActive) {
          setIsLoadingDefaults(false);
        }
      }
    };

    void initialize();

    return () => {
      isActive = false;
    };
  }, [workspaceApi]);

  useEffect(() => {
    if (!customDirectory) {
      setDirectoryPreview(defaultDirectory);
      return;
    }

    let isActive = true;

    const updatePreview = async () => {
      try {
        const preview = await workspaceApi.previewOutputDirectory(customDirectory);
        if (!isActive) {
          return;
        }
        setDirectoryPreview(preview.fullPath);
      } catch (error) {
        console.warn('[multiple-bulk-export] 保存先プレビューの取得に失敗しました', error);
      }
    };

    void updatePreview();

    return () => {
      isActive = false;
    };
  }, [customDirectory, defaultDirectory, workspaceApi]);

  useEffect(() => {
    let isDisposed = false;
    const debounce = window.setTimeout(() => {
      setIsValidating(true);
      setValidationError(null);

      workspaceApi
        .validateObjectSelection(settings.objectNames)
        .then((result) => {
          if (!isDisposed) {
            setValidationState(result);
          }
        })
        .catch((error) => {
          console.error('[multiple-bulk-export] バリデーションに失敗しました', error);
          if (!isDisposed) {
            setValidationError(
              error instanceof Error ? error.message : 'オブジェクト名の検証に失敗しました'
            );
          }
        })
        .finally(() => {
          if (!isDisposed) {
            setIsValidating(false);
          }
        });
    }, 400);

    return () => {
      isDisposed = true;
      window.clearTimeout(debounce);
    };
  }, [settings.objectNames, workspaceApi]);

  useEffect(() => {
    const unsubscribe = workspaceApi.subscribeProgress((event) => {
      if (event.type === 'completion') {
        setCompletion(event.payload);
        setDirectoryPreview(event.payload.outputDirectory ?? null);
        return;
      }

      setSnapshot((prev) => {
        switch (event.type) {
          case 'snapshot':
            setDirectoryPreview(event.payload.outputDirectory ?? null);
            return event.payload;
          case 'object-progress':
            if (!prev) {
              return prev;
            }

            return {
              ...prev,
              summary: event.payload.summary,
              objects: prev.objects.map((obj) =>
                obj.objectName === event.payload.progress.objectName ? event.payload.progress : obj
              ),
            };
          case 'log':
            if (!prev) {
              return {
                lifecycle: 'idle',
                summary: {
                  total: 0,
                  completed: 0,
                  failed: 0,
                  cancelled: 0,
                  running: 0,
                },
                objects: [],
                logs: [event.payload],
                outputDirectory: null,
              };
            }
            return {
              ...prev,
              logs: [...prev.logs, event.payload].slice(-LOG_HISTORY_LIMIT),
            };
          case 'lifecycle':
            if (!prev) {
              return prev;
            }

            return {
              ...prev,
              lifecycle: event.payload.lifecycle,
              summary: event.payload.summary,
              startedAt: event.payload.startedAt ?? prev.startedAt,
              finishedAt: event.payload.finishedAt ?? prev.finishedAt,
            };
          default:
            return prev;
        }
      });
    });

    return unsubscribe;
  }, [workspaceApi]);

  const handleInputChange = useCallback(
    (value: string) => {
      updateSetting({ objectNames: parseObjectInput(value) });
    },
    [updateSetting]
  );

  const handleStart = useCallback(async () => {
    setIsStarting(true);
    setStartError(null);
    setCompletion(null);

    try {
      const response = await workspaceApi.startExport({
        objects: settings.objectNames,
        outputDirectory: customDirectory,
      });

      setSnapshot(response.snapshot);
      setDirectoryPreview(response.outputDirectory);
      setStartError(null);
    } catch (error) {
      console.error('[multiple-bulk-export] エクスポート開始に失敗しました', error);
      setStartError(error instanceof Error ? error.message : 'エクスポートの開始に失敗しました');
    } finally {
      setIsStarting(false);
    }
  }, [customDirectory, settings.objectNames, workspaceApi]);

  const handleCancel = useCallback(async () => {
    try {
      await workspaceApi.cancelExport();
    } catch (error) {
      console.error('[multiple-bulk-export] エクスポートのキャンセルに失敗しました', error);
    }
  }, [workspaceApi]);

  const handleOpenDirectory = useCallback(async () => {
    if (!directoryPreview) {
      return;
    }
    try {
      await workspaceApi.openPath(directoryPreview);
    } catch (error) {
      console.error('[multiple-bulk-export] ディレクトリを開けませんでした', error);
    }
  }, [directoryPreview, workspaceApi]);

  const hasValidationErrors = (validationState?.result.errors.length ?? 0) > 0;
  const normalizedCount = validationState?.result.normalizedObjects.length ?? 0;
  const isRunning = snapshot?.lifecycle === 'running';
  const canStart = !isRunning && !hasValidationErrors && normalizedCount > 0 && !isValidating;
  const logs = snapshot?.logs ?? [];
  const summary = snapshot?.summary;

  const validationWarnings = validationState?.result.warnings ?? [];

  return (
    <LoginGate>
      <PageWithTheme>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={1}>
            <AppIcon size="L" />
            MultipleBulkExport
          </Heading>
          <SettingsDialog setting={settings} updateSetting={updateSetting} />
        </Flex>

        <Flex direction="column" gap="size-400">
          <View paddingY="size-200">
            <Heading level={2}>対象オブジェクト</Heading>
            <TextArea
              label="オブジェクト API 名 (改行区切り)"
              value={settings.objectNames.join('\n')}
              onChange={handleInputChange}
              isDisabled={isRunning}
              description="例: Account, CustomObject__c"
            />

            <Flex direction="column" gap="size-150" marginTop="size-150">
              {isValidating && <Text>入力内容を検証しています…</Text>}
              {validationError && <InlineError>{validationError}</InlineError>}
              {hasValidationErrors && (
                <Flex direction="column" gap="size-100">
                  {validationState?.result.errors.map((error, index) => (
                    <InlineError key={`${error.objectName ?? 'error'}-${index}`}>
                      {error.objectName ? `${error.objectName}: ${error.message}` : error.message}
                    </InlineError>
                  ))}
                </Flex>
              )}

              {validationWarnings.length > 0 && (
                <Well>
                  <Flex direction="column" gap="size-100">
                    {validationWarnings.map((warning, index) => (
                      <Text key={`${warning.objectName ?? 'warning'}-${index}`}>
                        {warning.objectName
                          ? `${warning.objectName}: ${warning.message}`
                          : warning.message}
                      </Text>
                    ))}
                  </Flex>
                </Well>
              )}
            </Flex>

            <View marginTop="size-300">
              <Flex alignItems="center" gap="size-200" wrap>
                <Heading level={2}>保存先ディレクトリ</Heading>
                <Text>{directoryPreview ?? '取得中…'}</Text>
              </Flex>
              {isLoadingDefaults && <Text>デフォルト保存先を取得しています…</Text>}
            </View>

            <Divider marginY="size-300" />

            <Flex gap="size-200">
              <Button variant="primary" onPress={handleStart} isDisabled={!canStart || isStarting}>
                {isStarting ? '開始中…' : 'エクスポートを開始'}
              </Button>
              {isRunning && (
                <Button variant="secondary" onPress={handleCancel}>
                  キャンセル
                </Button>
              )}
            </Flex>

            {startError && <InlineError marginTop="size-200">{startError}</InlineError>}
          </View>

          {summary && (
            <View>
              <Heading level={2}>進捗</Heading>
              <Flex gap="size-400" wrap marginBottom="size-300">
                <SummaryTile label="対象数" value={summary.total} />
                <SummaryTile label="実行中" value={summary.running} />
                <SummaryTile label="完了" value={summary.completed} />
                <SummaryTile label="失敗" value={summary.failed} />
                <SummaryTile label="キャンセル" value={summary.cancelled} />
              </Flex>

              <TableView aria-label="オブジェクトごとの進捗" density="compact">
                <TableHeader>
                  <Column minWidth={200}>オブジェクト</Column>
                  <Column width={120}>ステータス</Column>
                  <Column allowsResizing>進捗</Column>
                  <Column width={120}>取得済み</Column>
                  <Column width={120}>総数</Column>
                  <Column allowsResizing>メッセージ</Column>
                </TableHeader>
                <TableBody>
                  {snapshot?.objects.map((object) => {
                    const status = getStatusBadge(object.status);
                    const totalRecords =
                      typeof object.totalRecords === 'number' ? object.totalRecords : null;
                    const hasTotal = typeof totalRecords === 'number' && totalRecords > 0;
                    const percentage = hasTotal
                      ? Math.min(100, (object.processedRecords / totalRecords) * 100)
                      : 0;

                    return (
                      <Row key={object.objectName}>
                        <Cell>
                          <Flex direction="column" gap="size-50">
                            <Text>{object.label}</Text>
                            <Text
                              UNSAFE_style={{
                                color: 'var(--spectrum-neutral-content-color-subtle)',
                              }}
                            >
                              {object.objectName}
                            </Text>
                          </Flex>
                        </Cell>
                        <Cell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </Cell>
                        <Cell>
                          {object.status === 'running' && !hasTotal ? (
                            <ProgressBar aria-label="進行中" isIndeterminate />
                          ) : hasTotal ? (
                            <ProgressBar
                              aria-label={`${object.objectName} の進捗`}
                              value={percentage}
                              maxValue={100}
                            />
                          ) : (
                            <Text>-</Text>
                          )}
                        </Cell>
                        <Cell>{toDisplayNumber(object.processedRecords)}</Cell>
                        <Cell>{toDisplayNumber(object.totalRecords ?? null)}</Cell>
                        <Cell>
                          {object.error ? (
                            <Text
                              UNSAFE_style={{
                                color: 'var(--spectrum-negative-content-color-default)',
                              }}
                            >
                              {object.error}
                            </Text>
                          ) : object.outputPath ? (
                            <Text>{object.outputPath}</Text>
                          ) : (
                            <Text>-</Text>
                          )}
                        </Cell>
                      </Row>
                    );
                  })}
                </TableBody>
              </TableView>
            </View>
          )}

          {logs.length > 0 && (
            <View>
              <Heading level={2}>ログ</Heading>
              <Well>
                <Flex direction="column" gap="size-100">
                  {logs.map((log, index) => (
                    <LogEntry key={`${log.timestamp}-${index}`} entry={log} />
                  ))}
                </Flex>
              </Well>
            </View>
          )}

          {completion && (
            <View>
              <Heading level={2}>完了情報</Heading>
              <Content>
                <Flex direction="column" gap="size-150">
                  <Text>
                    {`完了時刻: ${
                      completion.finishedAt ? formatTimestamp(new Date(completion.finishedAt)) : '-'
                    }`}
                  </Text>
                  <Text>{`出力先: ${completion.outputDirectory ?? '-'}`}</Text>
                  <ActionButton
                    onPress={handleOpenDirectory}
                    isDisabled={!completion.outputDirectory}
                    alignSelf="start"
                  >
                    フォルダを開く
                  </ActionButton>
                  {completion.errors.length > 0 && (
                    <InlineError marginTop="size-150">
                      {completion.errors
                        .map((error) => `${error.objectName}: ${error.message}`)
                        .join('\n')}
                    </InlineError>
                  )}
                </Flex>
              </Content>
            </View>
          )}
        </Flex>
      </PageWithTheme>
    </LoginGate>
  );
};

type SummaryTileProps = {
  label: string;
  value: number;
};

const SummaryTile: React.FC<SummaryTileProps> = ({ label, value }) => (
  <View>
    <Text
      UNSAFE_style={{
        fontSize: '0.9rem',
        color: 'var(--spectrum-neutral-content-color-secondary)',
      }}
    >
      {label}
    </Text>
    <Text UNSAFE_style={{ fontSize: '1.6rem', fontWeight: 600 }}>
      {numberFormatter.format(value)}
    </Text>
  </View>
);

const LogEntry: React.FC<{ entry: ExportLogEntry }> = ({ entry }) => {
  const variant: React.ComponentProps<typeof Badge>['variant'] =
    entry.level === 'error' ? 'negative' : entry.level === 'warn' ? 'yellow' : 'info';

  return (
    <Flex gap="size-200" wrap>
      <Text UNSAFE_style={{ minWidth: 140 }}>
        {new Date(entry.timestamp).toLocaleString('ja-JP')}
      </Text>
      <Badge variant={variant}>
        {entry.objectName ? `${entry.objectName} - ${entry.message}` : entry.message}
      </Badge>
    </Flex>
  );
};

export default App;
export { AppIcon };
