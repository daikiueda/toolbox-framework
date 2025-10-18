import { useEffect, useState } from 'react';

import {
  Cell,
  Column,
  Flex,
  Heading,
  Row,
  TableBody,
  TableHeader,
  TableView,
  Text,
} from '@toolbox/design-system';

import type { LoginHistoryRecord } from '../../src/models';
import { useSalesforce } from '../../src/react/hooks';

export const LoginHistoryTable = (): JSX.Element => {
  const { query, orgInfo } = useSalesforce();
  const [loginHistory, setLoginHistory] = useState<LoginHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      if (!orgInfo) {
        setLoginHistory([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const soql = `SELECT Id, LoginTime, Status, Browser, Platform, SourceIp FROM LoginHistory WHERE UserId = '${orgInfo.userId}' ORDER BY LoginTime DESC LIMIT 10`;
        const result = await query<LoginHistoryRecord>(soql);
        setLoginHistory(result.records);
      } catch (err) {
        console.error('[LoginHistoryTable] ログイン履歴取得エラー:', err);
        setError(err instanceof Error ? err.message : 'ログイン履歴の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoginHistory();
  }, [query, orgInfo]);

  const formatLoginTime = (loginTime: string): string => {
    const date = new Date(loginTime);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Flex direction="column" gap="size-200">
        <Heading level={3}>ログイン履歴</Heading>
        <Text>読み込み中...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" gap="size-200">
        <Heading level={3}>ログイン履歴</Heading>
        <Text>
          <span style={{ color: 'var(--spectrum-global-color-red-600)' }}>{error}</span>
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="size-200" width="100%">
      <Heading level={3}>ログイン履歴</Heading>
      {loginHistory.length === 0 ? (
        <Text>ログイン履歴がありません</Text>
      ) : (
        <TableView aria-label="ログイン履歴" width="100%" height="size-6000">
          <TableHeader>
            <Column key="loginTime" width={200}>
              ログイン日時
            </Column>
            <Column key="status" width={100}>
              ステータス
            </Column>
            <Column key="browser" width={150}>
              ブラウザ
            </Column>
            <Column key="platform" width={150}>
              プラットフォーム
            </Column>
            <Column key="sourceIp" width={150}>
              IPアドレス
            </Column>
          </TableHeader>
          <TableBody>
            {loginHistory.map((record) => (
              <Row key={record.Id}>
                <Cell>{formatLoginTime(record.LoginTime)}</Cell>
                <Cell>{record.Status}</Cell>
                <Cell>{record.Browser ?? '-'}</Cell>
                <Cell>{record.Platform ?? '-'}</Cell>
                <Cell>{record.SourceIp ?? '-'}</Cell>
              </Row>
            ))}
          </TableBody>
        </TableView>
      )}
    </Flex>
  );
};
