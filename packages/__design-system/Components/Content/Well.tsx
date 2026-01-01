import React from 'react';

import { style } from '@toolbox/design-system/style' with { type: 'macro' };

type Props = React.ComponentProps<'div'>;

const migratedStyle = style({
  display: 'block',
  textAlign: 'start',
  padding: 16,
  minWidth: 160,
  marginTop: 4,
  borderWidth: 1,
  borderRadius: 'sm',
  borderStyle: 'solid',
  borderColor: 'transparent-black-75',
  backgroundColor: 'transparent-black-50',
  font: 'body-sm',
});

const Well: React.FC<Props> = ({ className, ...props }) => (
  <div className={[migratedStyle, className].join(' ')} {...props} />
);

export default React.memo(Well);
