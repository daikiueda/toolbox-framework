import { Flex, Heading } from '@toolbox/design-system';

import { useSalesforce } from '../src/react/hooks';

import { LoginForm } from './components/LoginForm';
import { LoginHistoryTable } from './components/LoginHistoryTable';
import { OrgInfo } from './components/OrgInfo';
import PageWithTheme from './components/PageWithTheme';

const App = (): JSX.Element => {
  const { LoginGate, orgInfo, logout, login, connectionState } = useSalesforce();

  const handleLogin = async (instanceUrl: string): Promise<void> => {
    await login(instanceUrl);
  };

  return (
    <PageWithTheme>
      <Heading level={1}>Salesforce</Heading>
      <Flex direction="column" gap="size-400" marginTop="size-400">
        {connectionState === 'connected' ? (
          <LoginGate>
            <Flex direction="column" gap="size-400">
              {orgInfo && <OrgInfo orgInfo={orgInfo} onLogout={logout} />}
              <LoginHistoryTable />
            </Flex>
          </LoginGate>
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </Flex>
    </PageWithTheme>
  );
};

export default App;
