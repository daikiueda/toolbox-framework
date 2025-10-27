import React, { useState } from 'react';

import { Button, Flex, Form, Radio, RadioGroup, TextField } from '@toolbox/design-system';

import { GENERAL_INSTANCE_URLS, InstanceUrlType } from '../../../lib/models/InstanceUrl';

type Props = {
  onLogin: (instanceUrl: string) => Promise<boolean>;
};

export const LoginForm: React.FC<Props> = ({ onLogin }) => {
  const [selectedType, setSelectedType] = useState<InstanceUrlType>('production');
  const [customUrl, setCustomUrl] = useState('');
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
      if (!validateUrl(customUrl)) {
        return;
      }
      instanceUrl = customUrl.trim();
    }

    setIsLoggingIn(true);
    try {
      await onLogin(instanceUrl);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Form width="size-6000">
      <RadioGroup
        label="インスタンスURL"
        value={selectedType}
        onChange={(value) => setSelectedType(value as InstanceUrlType)}
      >
        <Radio value="production">Production (login.salesforce.com)</Radio>
        <Radio value="sandbox">Sandbox (test.salesforce.com)</Radio>
        <Radio value="custom">Custom URL</Radio>
      </RadioGroup>

      {selectedType === 'custom' ? (
        <TextField
          label="カスタムURL"
          placeholder="https://your-domain.my.salesforce.com"
          value={customUrl}
          onChange={setCustomUrl}
          isRequired
          validationState={urlError ? 'invalid' : undefined}
          errorMessage={urlError}
        />
      ) : (
        <></>
      )}

      <Flex justifyContent="end" marginTop="size-400">
        <Button variant="cta" onPress={handleLogin} isDisabled={isLoggingIn}>
          {isLoggingIn ? 'ログイン中...' : 'ログイン'}
        </Button>
      </Flex>
    </Form>
  );
};
