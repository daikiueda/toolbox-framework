import React from 'react';

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
      <span style={{ color: 'var(--spectrum-global-color-red-600)' }}>
        {title || 'Oops! Something went wrong.'}
      </span>
    </Heading>
    <Content>{children}</Content>
  </InlineAlert>
);

export default InlineError;
