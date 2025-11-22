import React from 'react';

import { Badge, Flex, Heading, Text, View, Well } from '@toolbox/design-system';

import type { ExportLogEntry } from '../../../src/models';

export type LogsSectionProps = {
  logs: ExportLogEntry[];
};

export const LogsSection: React.FC<LogsSectionProps> = ({ logs }) => {
  if (logs.length === 0) {
    return null;
  }

  return (
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
  );
};

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
