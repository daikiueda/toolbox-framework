import React, { useEffect, useState } from 'react';

import {
  Cell,
  Column,
  Flex,
  Heading,
  InlineError,
  Row,
  Skeleton,
  TableBody,
  TableHeader,
  TableView,
  Text,
} from '@toolbox/design-system';

import { LoginHistoryRecord } from '../../src/models';

const LoginHistoryTable: React.FC = () => {
  const [loginHistory, setLoginHistory] = useState<LoginHistoryRecord[]>(
    new Array(10).fill(0).map(() => LoginHistoryRecord.default(window.crypto.randomUUID()))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await window.api!.orgAndLoginUser!.listRecentLoginHistory();
        setLoginHistory(result);
      } catch (err) {
        console.error('[LoginHistoryTable] ログイン履歴取得エラー:', err);
        setError(err instanceof Error ? err.message : 'ログイン履歴の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoginHistory();
  }, []);

  return (
    <Flex direction="column" gap="size-200" width="100%">
      <Heading level={3}>ログイン履歴</Heading>

      {error ? (
        <InlineError>{error}</InlineError>
      ) : loginHistory.length === 0 ? (
        <Text>ログイン履歴がありません</Text>
      ) : (
        <TableView aria-label="ログイン履歴" maxHeight="size-4600">
          <TableHeader>
            <Column width={200}>ログイン時刻 ({getTimezoneName()})</Column>
            <Column allowsResizing>状況</Column>
            <Column allowsResizing>アプリケーション</Column>
            <Column allowsResizing>アクセス元 IP</Column>
            <Column allowsResizing>場所</Column>
          </TableHeader>
          <TableBody>
            {loginHistory.map((record) => (
              <Row key={record.id}>
                <Cell>{isLoading ? <Skeleton /> : formatLoginTime(record.loginTime)}</Cell>
                <Cell>{isLoading ? <Skeleton /> : formatNullable(record.status)}</Cell>
                <Cell>{isLoading ? <Skeleton /> : formatNullable(record.application)}</Cell>
                <Cell>{isLoading ? <Skeleton /> : formatNullable(record.sourceIp)}</Cell>
                <Cell>
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    formatLocation(record.loginGeo?.country ?? null, record.loginGeo?.city ?? null)
                  )}
                </Cell>
              </Row>
            ))}
          </TableBody>
        </TableView>
      )}
    </Flex>
  );
};
export default LoginHistoryTable;

const getTimezoneName = () => {
  const options = { timeZoneName: 'short' as const };
  const formatter = new Intl.DateTimeFormat('ja-JP', options);

  const parts = formatter.formatToParts(new Date());
  return parts.find((p) => p?.type === 'timeZoneName')?.value;
};

const formatLoginTime = (loginTime: string): string => {
  const date = new Date(loginTime);
  return date.toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const formatNullable = (value: string | null | undefined): string =>
  value && value.trim().length > 0 ? value : '-';

const formatLocation = (country: string | null, city: string | null): string => {
  const location: string[] = [];

  if (city && city.trim().length > 0) {
    location.push(city);
  }

  if (country && country.trim().length > 0) {
    location.push(country);
  }

  return location.length ? location.join(', ') : '-';
};
