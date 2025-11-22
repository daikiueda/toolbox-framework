import React from 'react';

import {
  ActionButton,
  Content,
  Flex,
  Heading,
  InlineError,
  Text,
  View,
} from '@toolbox/design-system';

import type { ExportCompletionPayload } from '../../../src/models';
import { formatTimestamp } from '../../../src/utils/path';

export type CompletionSectionProps = {
  completion: ExportCompletionPayload | null;
  onOpenDirectory: () => void;
};

export const CompletionSection: React.FC<CompletionSectionProps> = ({
  completion,
  onOpenDirectory,
}) => {
  if (!completion) {
    return null;
  }

  return (
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
            onPress={onOpenDirectory}
            isDisabled={!completion.outputDirectory}
            alignSelf="start"
          >
            フォルダを開く
          </ActionButton>
          {completion.errors.length > 0 && (
            <InlineError marginTop="size-150">
              {completion.errors.map((error) => `${error.objectName}: ${error.message}`).join('\n')}
            </InlineError>
          )}
        </Flex>
      </Content>
    </View>
  );
};
