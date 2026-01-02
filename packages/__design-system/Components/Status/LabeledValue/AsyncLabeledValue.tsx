import React from 'react';

import SkeletonText from '../Skeleton/SkeletonText';

import LabeledValue from './LabeledValue';

type Props = {
  isLoading: boolean;
} & React.ComponentProps<typeof LabeledValue>;

const AsyncLabeledValue: React.FC<Props> = ({ isLoading, children, ...props }) => (
  <LabeledValue {...props}>
    <SkeletonText isLoading={isLoading}>{children}</SkeletonText>
  </LabeledValue>
);
export default AsyncLabeledValue;
