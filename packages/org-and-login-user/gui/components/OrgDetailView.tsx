import React, { useEffect, useState } from 'react';

import { AsyncLabeledValue, Flex, Heading, InlineError, View } from '@toolbox/design-system';

import { type OrgDetail } from '../../src/OrgDetail';

const OrgDetailView: React.FC = () => {
  const [orgDetail, setOrgDetail] = useState<OrgDetail>({ orgId: '', orgName: '' });
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

      <Flex direction="column" gap="size-100">
        {error && <InlineError margin="size-300">{error}</InlineError>}

        {!error && (
          <>
            <AsyncLabeledValue label="組織名" value={orgDetail.orgName} isLoading={isLoading} />
            <AsyncLabeledValue label="組織ID" value={orgDetail.orgId} isLoading={isLoading} />
          </>
        )}
      </Flex>
    </View>
  );
};

export default OrgDetailView;
