import React from 'react';

import {
  Badge,
  Cell,
  Column,
  Flex,
  Heading,
  ProgressBar,
  Row,
  TableBody,
  TableHeader,
  TableView,
  Text,
  View,
} from '@toolbox/design-system';

import type { ExportProgressSnapshot } from '../../../src/models';

const numberFormatter = new Intl.NumberFormat('ja-JP');

const toDisplayNumber = (value: number | null | undefined): string =>
  typeof value === 'number' && Number.isFinite(value) ? numberFormatter.format(value) : '-';

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

export type ProgressSectionProps = {
  snapshot: ExportProgressSnapshot | null;
};

export const ProgressSection: React.FC<ProgressSectionProps> = ({ snapshot }) => {
  if (!snapshot?.summary) {
    return null;
  }

  return (
    <View>
      <Heading level={2}>進捗</Heading>
      <Flex gap="size-400" wrap marginBottom="size-300">
        <SummaryTile label="対象数" value={snapshot.summary.total} />
        <SummaryTile label="実行中" value={snapshot.summary.running} />
        <SummaryTile label="完了" value={snapshot.summary.completed} />
        <SummaryTile label="失敗" value={snapshot.summary.failed} />
        <SummaryTile label="キャンセル" value={snapshot.summary.cancelled} />
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
          {snapshot.objects.map((object) => {
            const status = getStatusBadge(object.status);
            const totalRecords =
              typeof object.totalRecords === 'number' ? object.totalRecords : null;
            const hasTotal = typeof totalRecords === 'number' && totalRecords > 0;
            const percentage = hasTotal
              ? Math.min(100, (object.processedRecords / totalRecords) * 100)
              : 0;

            return (
              <Row key={object.objectName}>
                <CellWithMeta label={object.label} objectName={object.objectName} />
                <TableCellBadge variant={status.variant}>{status.label}</TableCellBadge>
                <TableCellProgress
                  objectName={object.objectName}
                  status={object.status}
                  hasTotal={hasTotal}
                  percentage={percentage}
                />
                <TableCellText value={toDisplayNumber(object.processedRecords)} />
                <TableCellText value={toDisplayNumber(object.totalRecords ?? null)} />
                <TableCellMessage error={object.error} path={object.outputPath} />
              </Row>
            );
          })}
        </TableBody>
      </TableView>
    </View>
  );
};

const SummaryTile: React.FC<{ label: string; value: number }> = ({ label, value }) => (
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

const TableCellText: React.FC<{ value: string }> = ({ value }) => (
  <Cell>
    <Text>{value}</Text>
  </Cell>
);

const TableCellBadge: React.FC<
  React.PropsWithChildren<{ variant: React.ComponentProps<typeof Badge>['variant'] }>
> = ({ children, variant }) => (
  <Cell>
    <Badge variant={variant}>{children}</Badge>
  </Cell>
);

const CellWithMeta: React.FC<{ label: string; objectName: string }> = ({ label, objectName }) => (
  <Cell>
    <Flex direction="column" gap="size-50">
      <Text>{label}</Text>
      <Text
        UNSAFE_style={{
          color: 'var(--spectrum-neutral-content-color-subtle)',
        }}
      >
        {objectName}
      </Text>
    </Flex>
  </Cell>
);

const TableCellProgress: React.FC<{
  objectName: string;
  status: string;
  hasTotal: boolean;
  percentage: number;
}> = ({ objectName, status, hasTotal, percentage }) => (
  <Cell>
    {status === 'running' && !hasTotal ? (
      <ProgressBar aria-label="進行中" isIndeterminate />
    ) : hasTotal ? (
      <ProgressBar aria-label={`${objectName} の進捗`} value={percentage} maxValue={100} />
    ) : (
      <Text>-</Text>
    )}
  </Cell>
);

const TableCellMessage: React.FC<{ error?: string | null; path?: string | null }> = ({
  error,
  path,
}) => (
  <Cell>
    {error ? (
      <Text
        UNSAFE_style={{
          color: 'var(--spectrum-negative-content-color-default)',
        }}
      >
        {error}
      </Text>
    ) : path ? (
      <Text>{path}</Text>
    ) : (
      <Text>-</Text>
    )}
  </Cell>
);
