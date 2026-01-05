import React from 'react';

import { Text } from '../../Content';
import { Skeleton } from '../index';

type Props = {
  isLoading: boolean;
  placeholder?: string;
  children: React.ReactNode;
};

const PLACEHOLDER = '(Loading...)';

const SkeletonText: React.FC<Props> = ({ isLoading, children, placeholder = PLACEHOLDER }) => (
  <Skeleton isLoading={isLoading}>
    <Text>{isLoading ? placeholder : children}</Text>
  </Skeleton>
);

export default SkeletonText;
