import React, { useEffect, useState } from 'react';

import { AsyncLabeledValue, Flex, Heading, InlineError, View } from '@toolbox/design-system';
import { style } from '@toolbox/design-system/style' with { type: 'macro' };

import { LoginUserDetail } from '../../src/models';

const LoginUserDetailView: React.FC = () => {
  const [loginUserDetail, setLoginUserDetail] = useState<LoginUserDetail>(
    LoginUserDetail.default()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoginUserDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await window.api!.orgAndLoginUser!.getLoginUserDetail();
        setLoginUserDetail(result);
      } catch (err) {
        console.error('[LoginHistoryTable] ユーザー情報取得エラー:', err);
        setError(err instanceof Error ? err.message : 'ログインユーザー情報の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchLoginUserDetail();
  }, []);

  return (
    <View>
      <Heading level={2}>ログインユーザー</Heading>

      <Flex direction="column" gap="size-250">
        {error && <InlineError styles={style({ margin: 24 })}>{error}</InlineError>}

        {!error && (
          <>
            <AsyncLabeledValue label="氏名" labelPosition="side" isLoading={isLoading}>
              {loginUserDetail.name}
            </AsyncLabeledValue>
            <div
              className={style({
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(272px, 1fr))',
                gap: 20,
              })}
            >
              <AsyncLabeledValue label="ユーザー ID" isLoading={isLoading}>
                {loginUserDetail.id}
              </AsyncLabeledValue>
              <AsyncLabeledValue label="ユーザー名" isLoading={isLoading}>
                {loginUserDetail.username}
              </AsyncLabeledValue>
              <AsyncLabeledValue label="メールアドレス" isLoading={isLoading}>
                {loginUserDetail.email}
              </AsyncLabeledValue>

              <AsyncLabeledValue label="プロファイル" isLoading={isLoading}>
                {loginUserDetail.profileName}
              </AsyncLabeledValue>
              <AsyncLabeledValue label="ロール" isLoading={isLoading}>
                {loginUserDetail.roleName || 'なし'}
              </AsyncLabeledValue>
              <AsyncLabeledValue label="従業員番号" isLoading={isLoading}>
                {loginUserDetail.employeeNumber || '未設定'}
              </AsyncLabeledValue>
            </div>
          </>
        )}
      </Flex>
    </View>
  );
};

export default LoginUserDetailView;
