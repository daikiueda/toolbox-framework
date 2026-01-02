import React, { useId } from 'react';

import { style } from '../../style' with { type: 'macro' };

type LabelPosition = 'top' | 'side';

export type LabeledValueProps = {
  /** The content to display as the label. */
  label: React.ReactNode;
  /** The value to display. */
  value: React.ReactNode;
  /** The label's overall position relative to the value. */
  labelPosition?: LabelPosition;
  /** Alignment of the label. */
  labelAlign?: 'start' | 'end';
};

const containerStylesTop = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

const containerStylesSide = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  gap: 8,
});

const labelStylesBase = style({
  font: 'ui-sm',
  color: 'neutral-subdued',
});

const labelStylesSide = style({
  font: 'ui-sm',
  color: 'neutral-subdued',
  minWidth: 128,
});

const valueStyles = style({
  font: 'ui',
  color: 'neutral',
});

export const LabeledValue: React.FC<LabeledValueProps> = ({
  label,
  value,
  labelPosition = 'top',
  labelAlign = 'start',
}) => {
  const labelId = useId();
  const isSide = labelPosition === 'side';

  return (
    <div className={isSide ? containerStylesSide : containerStylesTop}>
      <span
        id={labelId}
        className={isSide ? labelStylesSide : labelStylesBase}
        style={{ textAlign: labelAlign }}
      >
        {label}
      </span>
      <span aria-labelledby={labelId} className={valueStyles}>
        {value}
      </span>
    </div>
  );
};
