import React from 'react';

import { Button, Flex, Text } from '@toolbox/design-system';

import type { OrgInfo } from '../../src/OrgInfo';

type Props = {
  orgInfo: OrgInfo | null | undefined;
  onLogout: (() => Promise<void>) | null | undefined;
};

const SalesforceConnectionBar: React.FC<Props> = ({ orgInfo, onLogout }: Props) => {
  return (
    <Flex flex="1" direction="row-reverse" justifyContent="space-between" alignItems="center">
      <Button variant="secondary" onPress={onLogout ?? undefined}>
        ログアウト
      </Button>

      {orgInfo && (
        <Flex direction="row" gap="size-100">
          <Text>
            {orgInfo.orgName} ({orgInfo.orgId})
          </Text>

          <Text>{orgInfo.username}</Text>
        </Flex>
      )}
    </Flex>
  );
};
export default SalesforceConnectionBar;
