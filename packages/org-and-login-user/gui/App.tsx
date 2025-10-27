import React from 'react';

import { Flex, Heading } from '@toolbox/design-system';
import { useSalesforce } from '@toolbox/salesforce';

import LoginHistoryTable from './components/LoginHistoryTable';
import OrgDetailTable from './components/OrgDetailTable';
import PageWithTheme from './components/PageWithTheme';

const App: React.FC = () => {
  const { LoginGate } = useSalesforce();

  return (
    <LoginGate>
      <PageWithTheme>
        <Heading level={1}>Organization and Login User</Heading>
        <Flex direction="column" gap="size-400" marginTop="size-400">
          <OrgDetailTable />
          <LoginHistoryTable />
        </Flex>
      </PageWithTheme>
    </LoginGate>
  );
};

export default App;
