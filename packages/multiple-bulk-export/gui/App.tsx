import React, { useCallback, useEffect, useMemo, useState } from 'react';

import AppIcon from '@spectrum-icons/workflow/Organisations';

import { Flex, Heading, View, useSetting } from '@toolbox/design-system';
import { useSalesforce } from '@toolbox/salesforce';

import type {
  ExportCompletionPayload,
  ExportProgressSnapshot,
  ObjectSelectionState,
} from '../src/models';

import { Setting } from './Setting';
import PageWithTheme from './components/PageWithTheme';
import SettingsDialog from './components/SettingsDialog';
import { CompletionSection } from './components/sections/CompletionSection';
import { DirectoryInfoSection } from './components/sections/DirectoryInfoSection';
import { ExportControlsSection } from './components/sections/ExportControlsSection';
import { LogsSection } from './components/sections/LogsSection';
import { ObjectSelectionSection } from './components/sections/ObjectSelectionSection';
import { ProgressSection } from './components/sections/ProgressSection';
import { getWorkspaceApi } from './utils/getWorkspaceApi';

const LOG_HISTORY_LIMIT = 200;

const parseObjectInput = (value: string): string[] =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

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
            <ObjectSelectionSection
              objectNamesInput={settings.objectNames.join('\n')}
              onChange={handleInputChange}
              isRunning={isRunning}
              isValidating={isValidating}
              validationError={validationError}
              validationState={validationState}
            />
            <DirectoryInfoSection
              directoryPreview={directoryPreview}
              isLoadingDefaults={isLoadingDefaults}
            />
            <ExportControlsSection
              canStart={canStart}
              isStarting={isStarting}
              isRunning={isRunning}
              onStart={handleStart}
              onCancel={handleCancel}
              startError={startError}
            />
          </View>

          <ProgressSection snapshot={snapshot} />

          <LogsSection logs={logs} />

          <CompletionSection completion={completion} onOpenDirectory={handleOpenDirectory} />
        </Flex>
      </PageWithTheme>
    </LoginGate>
  );
};

export default App;
export { AppIcon };
