import React from 'react';

import { Button, Divider, Flex, InlineError, View } from '@toolbox/design-system';

export type ExportControlsSectionProps = {
  canStart: boolean;
  isStarting: boolean;
  isRunning: boolean;
  onStart: () => void;
  onCancel: () => void;
  startError: string | null;
};

export const ExportControlsSection: React.FC<ExportControlsSectionProps> = ({
  canStart,
  isStarting,
  isRunning,
  onStart,
  onCancel,
  startError,
}) => (
  <View marginTop="size-300">
    <Divider marginY="size-300" />

    <Flex gap="size-200">
      <Button variant="primary" onPress={onStart} isDisabled={!canStart || isStarting}>
        {isStarting ? '開始中…' : 'エクスポートを開始'}
      </Button>
      {isRunning && (
        <Button variant="secondary" onPress={onCancel}>
          キャンセル
        </Button>
      )}
    </Flex>

    {startError && <InlineError marginTop="size-200">{startError}</InlineError>}
  </View>
);
