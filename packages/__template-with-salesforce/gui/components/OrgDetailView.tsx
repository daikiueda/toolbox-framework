import React, { useEffect, useState } from 'react';

import { AsyncLabeledValue, Flex, Heading, InlineError, View } from '@toolbox/design-system';
import { style } from '@toolbox/design-system/style' with { type: 'macro' };

import { OrgDetail } from '../../src/models';
import { getWorkspaceApi } from '../utils/getWorkspaceApi';

const OrgDetailView: React.FC = () => {
  const [orgDetail, setOrgDetail] = useState<OrgDetail>(OrgDetail.default());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrgDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const api = getWorkspaceApi();
        const result = await api.getOrgDetail();
        setOrgDetail(result);
      } catch (err) {
        console.error('[OrgDetailView] 組織情報取得エラー:', err);
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
          <Flex direction="column" gap="size-250">
            <AsyncLabeledValue label="組織名" labelPosition="side" isLoading={isLoading}>
              {orgDetail.orgName}
            </AsyncLabeledValue>
            <AsyncLabeledValue label="組織 ID" isLoading={isLoading}>
              {orgDetail.orgId}
            </AsyncLabeledValue>
            <AsyncLabeledValue label="環境" isLoading={isLoading}>
              {orgDetail.orgType === 'Sandbox' ? 'Sandbox' : 'Production'}
            </AsyncLabeledValue>
            <AsyncLabeledValue label="エディション" isLoading={isLoading}>
              {orgDetail.organizationType}
            </AsyncLabeledValue>
            <AsyncLabeledValue label="インスタンス" isLoading={isLoading}>
              {orgDetail.instanceName}
            </AsyncLabeledValue>
          </Flex>
        )}
      </Flex>
    </View>
  );
};

export default OrgDetailView;
