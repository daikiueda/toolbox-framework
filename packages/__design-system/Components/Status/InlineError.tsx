import React from 'react';

import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { Heading } from '../Content';
import { Content } from '../Layout';

import { InlineAlert } from './index';

type Props = {
  title?: React.ReactNode;
  children: React.ReactNode;
} & React.ComponentProps<typeof InlineAlert>;

const InlineError = ({ children, title, ...props }: Props) => (
  <InlineAlert {...props} variant="negative">
    <Heading>
      <span className={style({ color: 'negative' })}>{title || 'Oops! Something went wrong.'}</span>
    </Heading>
    <Content>{children}</Content>
  </InlineAlert>
);

export default InlineError;
