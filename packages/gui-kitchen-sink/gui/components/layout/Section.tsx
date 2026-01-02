import React from 'react';

import { Divider, Heading, Text } from '@toolbox/design-system';
import { style } from '@toolbox/design-system/style' with { type: 'macro' };

type SectionProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, description, icon, children }) => (
  <div>
    <Divider styles={style({ marginTop: 40, marginBottom: 16 })} />
    <div className={style({ display: 'flex', alignItems: 'center', gap: 8 })}>
      {icon}
      <Heading level={2}>{title}</Heading>
    </div>
    {description && (
      <div className={style({ marginTop: 8 })}>
        <Text>{description}</Text>
      </div>
    )}
    <div className={style({ marginTop: 16 })}>{children}</div>
  </div>
);

export default Section;
