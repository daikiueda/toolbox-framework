import styled from 'styled-components';

import Logout from '@spectrum-icons/workflow/LogOut';

import { Button, Flex, Text } from '@toolbox/design-system';
import { useSalesforce } from '@toolbox/salesforce/client';

const Container = styled.div`
  padding: 12px 24px;
  border-top: 1px solid var(--spectrum-blue-300);
  background-color: var(--spectrum-blue-50);
`;

export const MenuFooterOrgInfo = (): JSX.Element | null => {
  const { connectionState, orgInfo, logout } = useSalesforce();

  if (connectionState !== 'connected' || !orgInfo) {
    return (
      <Container>
        <Text>
          <span style={{ fontSize: '12px', color: 'var(--spectrum-blue-900)' }}>
            Salesforce: 未接続
          </span>
        </Text>
      </Container>
    );
  }

  // 組織名を15文字以内に省略
  const displayOrgName =
    orgInfo.orgName.length > 15 ? `${orgInfo.orgName.slice(0, 12)}...` : orgInfo.orgName;

  return (
    <Container>
      <Flex direction="row" alignItems="center" justifyContent="space-between">
        <Text>
          <span style={{ fontSize: '12px', color: 'var(--spectrum-blue-900)' }}>
            SF: {displayOrgName}
          </span>
        </Text>
        <Button variant="primary" isQuiet onPress={logout} aria-label="ログアウト">
          <Logout size="S" />
        </Button>
      </Flex>
    </Container>
  );
};
