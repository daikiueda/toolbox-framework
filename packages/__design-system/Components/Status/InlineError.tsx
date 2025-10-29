import React from 'react';

import { InlineAlert } from '@react-spectrum/inlinealert';

import { Heading } from '../Content';
import { Content } from '../Layout';

type Props = {
  title?: React.ReactNode;
  children: React.ReactNode;
};

const InlineError = ({ children, title }: Props) => (
  <InlineAlert variant="negative">
    <Heading>{title || 'Oops! Something went wrong.'}</Heading>
    <Content>{children}</Content>
  </InlineAlert>
);

export default InlineError;
