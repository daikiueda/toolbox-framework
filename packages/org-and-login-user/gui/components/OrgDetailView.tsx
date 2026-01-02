import React, { useEffect, useState } from 'react';

import { AsyncLabeledValue, Flex, Heading, InlineError, View } from '@toolbox/design-system';
import { style } from '@toolbox/design-system/style' with { type: 'macro' };

import { OrgDetail } from '../../src/models';

const formatNumber = (num: number | null): string => {
  if (num === null) return '-';
  return num.toLocaleString();
};

const OrgDetailView: React.FC = () => {
  const [orgDetail, setOrgDetail] = useState<OrgDetail>(OrgDetail.default());
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
        {error && <InlineError styles={style({ margin: 24 })}>{error}</InlineError>}

        {!error && (
          <>
            <AsyncLabeledValue label="組織名" labelPosition="side" isLoading={isLoading}>
              {orgDetail.orgName}
            </AsyncLabeledValue>
            <div
              className={style({
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(192px, 1fr))',
                gap: 20,
              })}
            >
              <AsyncLabeledValue label="組織 ID" isLoading={isLoading}>
                {orgDetail.orgId}
              </AsyncLabeledValue>
              <AsyncLabeledValue label="組織タイプ" isLoading={isLoading}>
                {orgDetail.orgType ?? 'unknown'}
              </AsyncLabeledValue>
              <AsyncLabeledValue label="エディション" isLoading={isLoading}>
                {orgDetail.organizationType}
              </AsyncLabeledValue>
              <AsyncLabeledValue label="インスタンス" isLoading={isLoading}>
                {orgDetail.instanceName}
              </AsyncLabeledValue>
              <AsyncLabeledValue label="データ使用量" isLoading={isLoading}>
                {`${formatNumber(orgDetail.dataStorageUsed)} MB / ${formatNumber(orgDetail.dataStorageMax)} MB`}
              </AsyncLabeledValue>
              <AsyncLabeledValue label="ファイル使用量" isLoading={isLoading}>
                {`${formatNumber(orgDetail.fileStorageUsed)} MB / ${formatNumber(orgDetail.fileStorageMax)} MB`}
              </AsyncLabeledValue>
              <AsyncLabeledValue label="API 要求数" isLoading={isLoading}>
                {`${formatNumber(orgDetail.apiRequestsUsed)} / ${formatNumber(orgDetail.apiRequestsMax)}`}
              </AsyncLabeledValue>
            </div>
          </>
        )}
      </Flex>
    </View>
  );
};

export default OrgDetailView;
