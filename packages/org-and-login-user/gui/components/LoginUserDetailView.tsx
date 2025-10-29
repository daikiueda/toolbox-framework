import React, { useEffect, useState } from 'react';

import { AsyncLabeledValue, Flex, Heading, InlineError, View } from '@toolbox/design-system';

import { type LoginUserDetail } from '../../src/LoginUserDetail';

const LoginUserDetailView: React.FC = () => {
  const [loginUserDetail, setLoginUserDetail] = useState<LoginUserDetail>({
    id: '',
    username: '',
    email: '',
  });
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

      <Flex direction="column" gap="size-100">
        {error && <InlineError margin="size-300">{error}</InlineError>}

        {!error && (
          <>
            <AsyncLabeledValue
              label="ユーザーId"
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
          </>
        )}
      </Flex>
    </View>
  );
};

export default LoginUserDetailView;
