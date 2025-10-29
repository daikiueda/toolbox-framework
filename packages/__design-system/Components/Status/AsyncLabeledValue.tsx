import React from 'react';

import type { DOMRef } from '@react-types/shared';

import Skeleton from './Skeleton';
import { LabeledValue } from './index';

type Props = { isLoading: boolean } & React.ComponentProps<typeof LabeledValue>;

const AsyncLabeledValue = React.forwardRef(function AsyncLabeledValue(
  { isLoading, ...props }: Props,
  ref: DOMRef
) {
  return isLoading ? (
    <LabeledValue
      ref={ref}
      {...props}
      value={(<Skeleton />) as React.ReactElement}
      formatOptions={undefined}
    />
  ) : (
    <LabeledValue ref={ref} {...props} />
  );
});

export default AsyncLabeledValue;
