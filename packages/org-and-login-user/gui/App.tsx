import React from 'react';

import AppIcon from '@react-spectrum/s2/icons/Buildings';

import { Flex, Heading } from '@toolbox/design-system';
import { iconStyle } from '@toolbox/design-system/style' with { type: 'macro' };
import { useSalesforce } from '@toolbox/salesforce';

import LoginHistoryTable from './components/LoginHistoryTable';
import LoginUserDetailView from './components/LoginUserDetailView';
import OrgDetailView from './components/OrgDetailView';
import PageWithTheme from './components/PageWithTheme';

const App: React.FC = () => {
  const { LoginGate } = useSalesforce({ requireSfdxSession: true });

  return (
    <LoginGate>
      <PageWithTheme>
        <Heading level={1}>
          <AppIcon styles={iconStyle({ size: 'XL' })} />
          組織とログインユーザー
        </Heading>
        <Flex direction="column" gap="size-400">
          <OrgDetailView />
          <LoginUserDetailView />
          <LoginHistoryTable />
        </Flex>
      </PageWithTheme>
    </LoginGate>
  );
};

export default App;
export { AppIcon };
