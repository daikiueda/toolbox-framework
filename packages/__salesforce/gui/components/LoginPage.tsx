import React, { useEffect, useMemo, useState } from 'react';

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

import {
  GENERAL_INSTANCE_URLS,
  InstanceUrlType,
  normalizeCustomInstanceUrl,
} from '../../lib/models/InstanceUrl';

type Props = {
  onLogin: (instanceUrl: string) => Promise<boolean>;
};

const App: React.FC<Props> = ({ onLogin }) => {
  const [selectedType, setSelectedType] = useState<InstanceUrlType>('production');
  const [customDomain, setCustomDomain] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [urlError, setUrlError] = useState<string | undefined>(undefined);

  const normalizedCustomDomain = useMemo(
    () => normalizeCustomInstanceUrl(customDomain),
    [customDomain]
  );

  useEffect(() => {
    if (selectedType !== 'custom') {
      setUrlError(undefined);
      return;
    }

    if (!customDomain.trim()) {
      setUrlError(undefined);
      return;
    }

    if (normalizedCustomDomain) {
      setUrlError(undefined);
    }
  }, [selectedType, customDomain, normalizedCustomDomain]);

  const resolveCustomInstanceUrl = (): string | null => {
    if (!customDomain.trim()) {
      setUrlError('URLを入力してください');
      return null;
    }

    if (!normalizedCustomDomain) {
      setUrlError('force.comで終わるドメインを入力してください');
      return null;
    }

    setUrlError(undefined);
    return normalizedCustomDomain;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let instanceUrl: string;

    if (selectedType === 'production') {
      instanceUrl = GENERAL_INSTANCE_URLS.PRODUCTION;
    } else if (selectedType === 'sandbox') {
      instanceUrl = GENERAL_INSTANCE_URLS.SANDBOX;
    } else {
      const normalized = resolveCustomInstanceUrl();
      if (!normalized) {
        return;
      }
      instanceUrl = normalized;
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
      <Heading level={1}>ログイン</Heading>
      <Form onSubmit={handleSubmit} width="size-6000">
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
            description={normalizedCustomDomain ?? undefined}
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
