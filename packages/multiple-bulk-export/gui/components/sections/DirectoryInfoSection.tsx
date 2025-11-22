import React from 'react';

import { Flex, Heading, Text, View } from '@toolbox/design-system';

export type DirectoryInfoSectionProps = {
  directoryPreview: string | null;
  isLoadingDefaults: boolean;
};

export const DirectoryInfoSection: React.FC<DirectoryInfoSectionProps> = ({
  directoryPreview,
  isLoadingDefaults,
}) => (
  <View marginTop="size-300">
    <Flex alignItems="center" gap="size-200" wrap>
      <Heading level={2}>保存先ディレクトリ</Heading>
      <Text>{directoryPreview ?? '取得中…'}</Text>
    </Flex>
    {isLoadingDefaults && <Text>デフォルト保存先を取得しています…</Text>}
  </View>
);
