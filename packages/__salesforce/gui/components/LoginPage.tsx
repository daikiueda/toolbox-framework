import React, { useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';

import {
  Button,
  Divider,
  Flex,
  Form,
  Heading,
  InlineError,
  Page,
  Picker,
  PickerItem,
  Radio,
  RadioGroup,
  Skeleton,
  Text,
  TextField,
} from '@toolbox/design-system';
import { style } from '@toolbox/design-system/style' with { type: 'macro' };

import type { AuthOrg, AuthOrgError, AuthOrgResult } from '../../lib/core/sfdx/SfdxAuthService';
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
  getAuthenticatedOrgs: () => Promise<AuthOrgResult>;
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
  const [isLoadingAuthenticatedOrgs, setIsLoadingAuthenticatedOrgs] = useState(false);
  const [authOrgError, setAuthOrgError] = useState<AuthOrgError | null>(null);

  // ログイン処理中かどうかを connectionState から判定
  const isLoggingIn = connectionState === 'connecting';

  // 認証済み組織一覧を取得
  useEffect(() => {
    const fetchOrgs = async () => {
      setIsLoadingAuthenticatedOrgs(true);
      setAuthOrgError(null);
      try {
        const result = await getAuthenticatedOrgs();
        const orgs = result.orgs;
        setAuthenticatedOrgs(orgs);

        if (result.error) {
          setAuthOrgError(result.error);
          setSelectedOrgUsername('');
          return;
        }

        if (orgs.length === 0) {
          setAuthOrgError({
            code: 'no_orgs',
            message: '認証済みの組織がありません。',
          });
          setSelectedOrgUsername('');
          return;
        }

        const defaultOrg = orgs.find((org) => org.isDefaultOrg);
        if (defaultOrg) {
          setSelectedOrgUsername(defaultOrg.username);
        }
      } catch (error) {
        console.error('[LoginPage] 認証済み組織一覧取得エラー:', error);
        setAuthOrgError({
          code: 'unknown',
          message: '認証済み組織の取得に失敗しました。',
        });
        setAuthenticatedOrgs([]);
        setSelectedOrgUsername('');
      } finally {
        setIsLoadingAuthenticatedOrgs(false);
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

  if (useSfdxSession && !isLoadingAuthenticatedOrgs && authOrgError?.code === 'cli_not_found') {
    return (
      <PageWithTheme>
        <Heading level={1}>Salesforce CLI が必要です</Heading>
        <Flex direction="column" gap="size-200" maxWidth="size-6000">
          <Text>この機能は Salesforce CLI がインストールされている環境で動作します。</Text>
          <Text>まだインストールしていない場合は、以下のページからセットアップしてください。</Text>
          <Text>
            <a
              href="https://developer.salesforce.com/tools/sfdxcli"
              rel="noreferrer"
              target="_blank"
            >
              Salesforce CLI のインストール手順
            </a>
          </Text>
        </Flex>
      </PageWithTheme>
    );
  }

  return (
    <PageWithTheme>
      <Heading level={1}>ログイン</Heading>
      <Form onSubmit={handleSubmit}>
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
            isInvalid={!!urlError}
            errorMessage={urlError}
            description={normalizedCustomDomain ?? undefined}
            styles={style({ width: 480 })}
          />
        ) : (
          <></>
        )}

        <Flex justifyContent="start" marginTop="size-400">
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

      {(isLoadingAuthenticatedOrgs || authOrgError || authenticatedOrgs.length > 0) && (
        <>
          <Divider styles={style({ marginTop: 48, marginBottom: 32 })} />

          <Flex direction="column" gap="size-200">
            <Heading level={2}>認証済み組織でログイン</Heading>

            {isLoadingAuthenticatedOrgs ? (
              <Skeleton height={32} width={360} />
            ) : authOrgError ? (
              <InlineError>{authOrgError.message}</InlineError>
            ) : authenticatedOrgs.length > 0 ? (
              <>
                <Picker
                  label="組織を選択"
                  value={selectedOrgUsername}
                  onChange={(key) => setSelectedOrgUsername(key as string)}
                  styles={style({ width: 480 })}
                >
                  {authenticatedOrgs.map((org) => (
                    <PickerItem
                      key={org.username}
                      id={org.username}
                      textValue={org.alias || org.username}
                    >
                      {org.alias ? `${org.alias} (${org.username})` : org.username}
                    </PickerItem>
                  ))}
                </Picker>

                <Flex justifyContent="start" marginTop="size-200">
                  <Button
                    variant="accent"
                    onPress={handleAuthOrgLogin}
                    isDisabled={!selectedOrgUsername || isLoggingIn}
                  >
                    {isLoggingIn ? '認証中...' : '選択した組織でログイン'}
                  </Button>
                </Flex>
              </>
            ) : (
              <Text>認証済みの組織がありません。</Text>
            )}
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
