import React, { useState } from 'react';

import styled from 'styled-components';

import {
  Button,
  Flex,
  Form,
  Heading,
  Page,
  Radio,
  RadioGroup,
  TextField,
} from '@toolbox/design-system';

import { GENERAL_INSTANCE_URLS, InstanceUrlType } from '../../lib/models/InstanceUrl';

type Props = {
  onLogin: (instanceUrl: string) => Promise<boolean>;
};

const App: React.FC<Props> = ({ onLogin }) => {
  const [selectedType, setSelectedType] = useState<InstanceUrlType>('production');
  const [customDomain, setCustomDomain] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [urlError, setUrlError] = useState<string | undefined>(undefined);

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setUrlError('URLを入力してください');
      return false;
    }
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'https:') {
        setUrlError('HTTPSのURLを指定してください');
        return false;
      }
      setUrlError(undefined);
      return true;
    } catch {
      setUrlError('有効なURLを入力してください');
      return false;
    }
  };

  const handleLogin = async () => {
    let instanceUrl: string;

    if (selectedType === 'production') {
      instanceUrl = GENERAL_INSTANCE_URLS.PRODUCTION;
    } else if (selectedType === 'sandbox') {
      instanceUrl = GENERAL_INSTANCE_URLS.SANDBOX;
    } else {
      if (!validateUrl(customDomain)) {
        return;
      }
      instanceUrl = customDomain.trim();
    }

    setIsLoggingIn(true);
    try {
      await onLogin(instanceUrl);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <PageWithTheme>
      <Heading level={1}>Login</Heading>
      <Form onSubmit={handleLogin} width="size-6000">
        <RadioGroup
          label="インスタンスURL"
          value={selectedType}
          onChange={(value) => setSelectedType(value as InstanceUrlType)}
        >
          <Radio value="production">Production (login.salesforce.com)</Radio>
          <Radio value="sandbox">Sandbox (test.salesforce.com)</Radio>
          <Radio value="custom">カスタムドメイン</Radio>
        </RadioGroup>

        {selectedType === 'custom' ? (
          <TextField
            label="カスタムドメイン"
            value={customDomain}
            onChange={setCustomDomain}
            isRequired
            validationState={urlError ? 'invalid' : undefined}
            errorMessage={urlError}
          />
        ) : (
          <></>
        )}

        <Flex justifyContent="center" marginTop="size-400">
          <Button type="submit" variant="accent" isDisabled={isLoggingIn}>
            {isLoggingIn ? 'ログイン中...' : 'ログイン'}
          </Button>
        </Flex>
      </Form>
    </PageWithTheme>
  );
};

export default App;

const PageWithTheme = styled(Page)`
  & {
    *:is(h1, h2, h3, h4, h5, h6) {
      color: var(--spectrum-blue-900);
    }
  }
`;
