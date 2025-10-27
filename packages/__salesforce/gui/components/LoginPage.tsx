import React from 'react';

import styled from 'styled-components';

import { Flex, Heading, Page } from '@toolbox/design-system';

import { LoginForm } from './shared/LoginForm';

type Props = {
  onLogin: (instanceUrl: string) => Promise<boolean>;
};

const App: React.FC<Props> = ({ onLogin }) => (
  <PageWithTheme>
    <Heading level={1}>Organization and Login User</Heading>
    <Flex direction="column" gap="size-400" marginTop="size-400">
      <LoginForm onLogin={onLogin} />
    </Flex>
  </PageWithTheme>
);

export default App;

const PageWithTheme = styled(Page)`
  & {
    *:is(h1, h2, h3, h4, h5, h6) {
      color: var(--spectrum-blue-900);
    }
  }
`;
