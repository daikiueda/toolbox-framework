import React from 'react';

import { LabeledValue, type LabeledValueProps } from './LabeledValue';
import Skeleton from './Skeleton';

type Props = {
  isLoading: boolean;
} & LabeledValueProps;

const AsyncLabeledValue: React.FC<Props> = ({ isLoading, ...props }) => {
  return isLoading ? <LabeledValue {...props} value={<Skeleton />} /> : <LabeledValue {...props} />;
};

export default AsyncLabeledValue;
