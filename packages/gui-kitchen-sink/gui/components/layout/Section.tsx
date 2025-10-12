import React from 'react';

import { Flex, Heading, Text, View } from '@toolbox/design-system';

type SectionProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, description, icon, children }) => (
  <View marginTop="size-400">
    <Flex alignItems="center" gap="size-100">
      {icon}
      <Heading level={2}>{title}</Heading>
    </Flex>
    {description && (
      <View marginTop="size-100">
        <Text>{description}</Text>
      </View>
    )}
    <View marginTop="size-200">{children}</View>
  </View>
);

export default Section;
