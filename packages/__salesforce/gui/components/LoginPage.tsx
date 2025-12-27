import React, { useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';

import {
  Button,
  Divider,
  Flex,
  Form,
  Heading,
  Page,
  Picker,
  PickerItem,
  Radio,
  RadioGroup,
  TextField,
} from '@toolbox/design-system';

import type { AuthOrg } from '../../lib/core/sfdx/SfdxAuthService';
import type { ConnectionState } from '../../lib/models/ConnectionState';
import {
  GENERAL_INSTANCE_URLS,
  InstanceUrlType,
  normalizeCustomInstanceUrl,
} from '../../lib/models/InstanceUrl';

type Props = {
  useSfdxSession: boolean;
  onLoginWithOAuth: (instanceUrl: string) => Promise<boolean>;
  onLoginWithSfdx: (instanceUrl: string) => Promise<boolean>;
  onLoginWithAuthOrg: (usernameOrAlias: string) => Promise<boolean>;
  getAuthenticatedOrgs: () => Promise<AuthOrg[]>;
  connectionState: ConnectionState;
};

const App: React.FC<Props> = ({
  onLoginWithOAuth,
  useSfdxSession,
  onLoginWithSfdx,
  onLoginWithAuthOrg,
  getAuthenticatedOrgs,
  connectionState,
}) => {
  const [selectedType, setSelectedType] = useState<InstanceUrlType>('production');
  const [customDomain, setCustomDomain] = useState('');
  const [urlError, setUrlError] = useState<string | undefined>(undefined);
  const [authenticatedOrgs, setAuthenticatedOrgs] = useState<AuthOrg[]>([]);
  const [selectedOrgUsername, setSelectedOrgUsername] = useState<string>('');

  // ログイン処理中かどうかを connectionState から判定
  const isLoggingIn = connectionState === 'connecting';

  // 認証済み組織一覧を取得
  useEffect(() => {
    const fetchOrgs = async () => {
      const orgs = await getAuthenticatedOrgs();
      setAuthenticatedOrgs(orgs);
      // デフォルト組織があれば自動選択
      const defaultOrg = orgs.find((org) => org.isDefaultOrg);
      if (defaultOrg) {
        setSelectedOrgUsername(defaultOrg.username);
      }
    };
    fetchOrgs();
  }, [getAuthenticatedOrgs]);

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

  const isSubmitDisabled = useMemo(() => {
    // ログイン中は非活性
    if (isLoggingIn) return true;

    // カスタムドメイン選択時の検証
    if (selectedType === 'custom') {
      // ドメインが空の場合は非活性
      if (!customDomain.trim()) return true;
      // 正規化できない（無効な）ドメインの場合は非活性
      if (!normalizedCustomDomain) return true;
    }

    return false;
  }, [isLoggingIn, selectedType, customDomain, normalizedCustomDomain]);

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

    // instanceUrl を解決
    let instanceUrl: string | undefined;
    if (selectedType === 'production') {
      instanceUrl = GENERAL_INSTANCE_URLS.PRODUCTION;
    } else if (selectedType === 'sandbox') {
      instanceUrl = GENERAL_INSTANCE_URLS.SANDBOX;
    } else if (selectedType === 'custom') {
      const normalized = resolveCustomInstanceUrl();
      if (!normalized) return;
      instanceUrl = normalized;
    }

    // instanceUrl が解決されていることを確認
    if (!instanceUrl) return;

    // モードに応じてログイン実行（connectionState の更新は Provider で行われる）
    if (useSfdxSession) {
      await onLoginWithSfdx(instanceUrl);
    } else {
      await onLoginWithOAuth(instanceUrl);
    }
  };

  const handleAuthOrgLogin = async () => {
    if (!selectedOrgUsername) return;
    await onLoginWithAuthOrg(selectedOrgUsername);
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
          <Button type="submit" variant="accent" isDisabled={isSubmitDisabled}>
            {useSfdxSession
              ? isLoggingIn
                ? 'sfdx でログイン中...'
                : 'sfdx でログイン'
              : isLoggingIn
                ? 'ログイン中...'
                : 'ログイン'}
          </Button>
        </Flex>
      </Form>

      {authenticatedOrgs.length > 0 && (
        <>
          <Divider size="M" marginTop="size-400" marginBottom="size-400" />

          <Flex direction="column" gap="size-200" width="size-6000">
            <Heading level={3}>認証済み組織でログイン</Heading>

            <Picker
              label="組織を選択"
              selectedKey={selectedOrgUsername}
              onSelectionChange={(key) => setSelectedOrgUsername(key as string)}
              width="size-6000"
            >
              {authenticatedOrgs.map((org) => (
                <PickerItem key={org.username} textValue={org.alias || org.username}>
                  {org.alias ? `${org.alias} (${org.username})` : org.username}
                </PickerItem>
              ))}
            </Picker>

            <Flex justifyContent="center" marginTop="size-200">
              <Button
                variant="accent"
                onPress={handleAuthOrgLogin}
                isDisabled={!selectedOrgUsername || isLoggingIn}
              >
                {isLoggingIn ? '認証中...' : '選択した組織でログイン'}
              </Button>
            </Flex>
          </Flex>
        </>
      )}
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
