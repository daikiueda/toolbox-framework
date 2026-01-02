import React from 'react';

import { Divider, Heading, Text, View } from '@toolbox/design-system';
import { style } from '@toolbox/design-system/style' with { type: 'macro' };

type SectionProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, description, icon, children }) => (
  <View>
    <Divider styles={style({ marginTop: 40, marginBottom: 16 })} />
    <div className={style({ display: 'flex', alignItems: 'center', gap: 8 })}>
      {icon}
      <Heading level={2}>{title}</Heading>
    </div>
    {description && (
      <View marginTop="size-100">
        <Text>{description}</Text>
      </View>
    )}
    <View marginTop="size-200">{children}</View>
  </View>
);

export default Section;
