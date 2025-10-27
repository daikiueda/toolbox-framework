import React, { useEffect, useState } from 'react';

import { Flex, Heading, Text, View } from '@toolbox/design-system';

import type { OrgDetail } from '../../src/OrgDetail';

const OrgDetailTable: React.FC = () => {
  const [orgDetail, setOrgDetail] = useState<OrgDetail>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrgDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await window.api!.orgAndLoginUser!.getOrgDetail();
        setOrgDetail(result);
      } catch (err) {
        console.error('[LoginHistoryTable] 組織情報取得エラー:', err);
        setError(err instanceof Error ? err.message : '組織情報の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrgDetail();
  }, []);

  if (isLoading || !orgDetail) {
    return (
      <Flex direction="column" gap="size-200">
        <Heading level={3}>組織詳細</Heading>
        <Text>読み込み中...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" gap="size-200">
        <Heading level={3}>組織詳細</Heading>
        <Text>
          <span style={{ color: 'var(--spectrum-global-color-red-600)' }}>{error}</span>
        </Text>
      </Flex>
    );
  }

  return (
    <View
      borderWidth="thin"
      borderColor="default"
      borderRadius="medium"
      padding="size-300"
      width="size-6000"
    >
      <Flex direction="column" gap="size-200">
        <Heading level={3}>組織情報</Heading>

        <Flex direction="column" gap="size-100">
          <Flex direction="row" gap="size-100">
            <Text>
              <strong>組織名:</strong>
            </Text>
            <Text>{orgDetail.orgName}</Text>
          </Flex>

          <Flex direction="row" gap="size-100">
            <Text>
              <strong>組織ID:</strong>
            </Text>
            <Text>{orgDetail.orgId}</Text>
          </Flex>

          <Flex direction="row" gap="size-100">
            <Text>
              <strong>ユーザー名:</strong>
            </Text>
            <Text>{orgDetail.username}</Text>
          </Flex>

          <Flex direction="row" gap="size-100">
            <Text>
              <strong>メールアドレス:</strong>
            </Text>
            <Text>{orgDetail.email}</Text>
          </Flex>
        </Flex>
      </Flex>
    </View>
  );
};

export default OrgDetailTable;
