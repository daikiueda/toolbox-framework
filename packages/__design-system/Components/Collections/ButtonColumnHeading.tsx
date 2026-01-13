import React from 'react';

import { style } from '../../style' with { type: 'macro' };

type Props = React.ComponentProps<'span'>;

const ButtonColumnHeading: React.FC<Props> = ({ children, ...props }) => (
  <span
    className={style({
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 'text-to-visual',
      paddingEnd: 12,
    })}
    {...props}
  >
    {children}
  </span>
);

export default ButtonColumnHeading;
