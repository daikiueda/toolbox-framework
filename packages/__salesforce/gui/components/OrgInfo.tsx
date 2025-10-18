import { Button, Flex, Heading, Text, View } from '@toolbox/design-system';

import type { OrgInfo as OrgInfoType } from '../../src/models';

type OrgInfoProps = {
  orgInfo: OrgInfoType;
  onLogout: () => Promise<void>;
};

export const OrgInfo = ({ orgInfo, onLogout }: OrgInfoProps): JSX.Element => {
  return (
    <View
      borderWidth="thin"
      borderColor="default"
      borderRadius="medium"
      padding="size-300"
      width="size-6000"
    >
      <Flex direction="column" gap="size-200">
        <Heading level={3}>組織情報</Heading>

        <Flex direction="column" gap="size-100">
          <Flex direction="row" gap="size-100">
            <Text>
              <strong>組織名:</strong>
            </Text>
            <Text>{orgInfo.orgName}</Text>
          </Flex>

          <Flex direction="row" gap="size-100">
            <Text>
              <strong>組織ID:</strong>
            </Text>
            <Text>{orgInfo.orgId}</Text>
          </Flex>

          <Flex direction="row" gap="size-100">
            <Text>
              <strong>ユーザー名:</strong>
            </Text>
            <Text>{orgInfo.username}</Text>
          </Flex>

          <Flex direction="row" gap="size-100">
            <Text>
              <strong>メールアドレス:</strong>
            </Text>
            <Text>{orgInfo.email}</Text>
          </Flex>
        </Flex>

        <Flex justifyContent="end" marginTop="size-200">
          <Button variant="secondary" onPress={onLogout}>
            ログアウト
          </Button>
        </Flex>
      </Flex>
    </View>
  );
};
