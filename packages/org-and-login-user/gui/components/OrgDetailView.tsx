import React, { useEffect, useState } from 'react';

import { AsyncLabeledValue, Flex, Heading, InlineError, View } from '@toolbox/design-system';

import { type OrgDetail } from '../../src/OrgDetail';

const formatNumber = (num: number | null): string => {
  if (num === null) return '-';
  return num.toLocaleString();
};

const OrgDetailView: React.FC = () => {
  const [orgDetail, setOrgDetail] = useState<OrgDetail>({
    orgId: '',
    orgName: '',
    orgType: 'Production',
    organizationType: '',
    instanceName: '',
    dataStorageUsed: null,
    dataStorageMax: null,
    fileStorageUsed: null,
    fileStorageMax: null,
    apiRequestsUsed: null,
    apiRequestsMax: null,
  });
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

    void fetchOrgDetail();
  }, []);

  return (
    <View>
      <Heading level={2}>組織</Heading>

      <Flex direction="column" gap="size-250">
        {error && <InlineError margin="size-300">{error}</InlineError>}

        {!error && (
          <>
            <AsyncLabeledValue label="組織名" value={orgDetail.orgName} isLoading={isLoading} />
            <AsyncLabeledValue label="組織 ID" value={orgDetail.orgId} isLoading={isLoading} />
            <AsyncLabeledValue label="組織タイプ" value={orgDetail.orgType} isLoading={isLoading} />
            <AsyncLabeledValue
              label="エディション"
              value={orgDetail.organizationType}
              isLoading={isLoading}
            />
            <AsyncLabeledValue
              label="インスタンス"
              value={orgDetail.instanceName}
              isLoading={isLoading}
            />
            <AsyncLabeledValue
              label="データ使用量"
              value={`${formatNumber(orgDetail.dataStorageUsed)} MB / ${formatNumber(orgDetail.dataStorageMax)} MB`}
              isLoading={isLoading}
            />
            <AsyncLabeledValue
              label="ファイル使用量"
              value={`${formatNumber(orgDetail.fileStorageUsed)} MB / ${formatNumber(orgDetail.fileStorageMax)} MB`}
              isLoading={isLoading}
            />
            <AsyncLabeledValue
              label="API 要求数"
              value={`${formatNumber(orgDetail.apiRequestsUsed)} / ${formatNumber(orgDetail.apiRequestsMax)}`}
              isLoading={isLoading}
            />
          </>
        )}
      </Flex>
    </View>
  );
};

export default OrgDetailView;
