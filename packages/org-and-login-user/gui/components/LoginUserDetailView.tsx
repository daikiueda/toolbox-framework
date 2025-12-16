import React, { useEffect, useState } from 'react';

import {
  AsyncLabeledValue,
  Flex,
  Grid,
  Heading,
  InlineError,
  View,
  repeat,
} from '@toolbox/design-system';

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
        {error && <InlineError margin="size-300">{error}</InlineError>}

        {!error && (
          <>
            <AsyncLabeledValue
              label="氏名"
              labelPosition="side"
              value={loginUserDetail.name}
              isLoading={isLoading}
            />
            <Grid columns={repeat('auto-fit', 'size-3400')} gap="size-250">
              <AsyncLabeledValue
                label="ユーザー ID"
                value={loginUserDetail.id}
                isLoading={isLoading}
              />
              <AsyncLabeledValue
                label="ユーザー名"
                value={loginUserDetail.username}
                isLoading={isLoading}
              />
              <AsyncLabeledValue
                label="メールアドレス"
                value={loginUserDetail.email}
                isLoading={isLoading}
              />
              <AsyncLabeledValue
                label="プロファイル"
                value={loginUserDetail.profileName}
                isLoading={isLoading}
              />
              <AsyncLabeledValue
                label="ロール"
                value={loginUserDetail.roleName || 'なし'}
                isLoading={isLoading}
              />
              <AsyncLabeledValue
                label="従業員番号"
                value={loginUserDetail.employeeNumber || '未設定'}
                isLoading={isLoading}
              />
            </Grid>
          </>
        )}
      </Flex>
    </View>
  );
};

export default LoginUserDetailView;
