import React from 'react';

import styled from 'styled-components';

import { Badge, Button, Flex } from '@toolbox/design-system';

import type { OrgInfo } from '../../src/OrgInfo';

type Props = {
  orgInfo: OrgInfo | null | undefined;
  onLogout: (() => Promise<void>) | undefined;
};

const SalesforceConnectionBar: React.FC<Props> = ({ orgInfo, onLogout }: Props) => {
  if (!orgInfo) {
    return <Disconnected>disconnected</Disconnected>;
  }

  return (
    <Connected>
      <Flex alignItems="center" gap="size-100">
        <Badge variant={orgInfo.orgType === 'Production' ? 'info' : 'neutral'}>
          {orgInfo.orgType}
        </Badge>
        <OrgId>{orgInfo.orgId}</OrgId>
        <OrgName>{orgInfo.orgName}</OrgName>
      </Flex>

      <Button variant="secondary" onPress={onLogout}>
        logout
      </Button>
    </Connected>
  );
};
export default SalesforceConnectionBar;

const Header = styled.header`
  height: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  border-bottom: 1px solid var(--spectrum-gray-200);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
`;

const Disconnected = styled(Header)`
  height: 24px;
  justify-content: center;

  font-weight: bold;
  color: var(--spectrum-gray-1000);
  background: repeating-linear-gradient(
    -45deg,
    var(--spectrum-gray-300),
    var(--spectrum-gray-300) 10px,
    var(--spectrum-gray-200) 0,
    var(--spectrum-gray-200) 20px
  );
`;

const Connected = styled(Header)`
  height: 48px;
  justify-content: space-between;
`;

const OrgName = styled.span`
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: min(36vw, 360px);
`;

const OrgId = styled.span`
  color: var(--spectrum-gray-600);
  white-space: nowrap;
  font-size: 11px;
  &::after {
    content: ' - ';
  }
`;
