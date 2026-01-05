import { ArgTypes } from '@storybook/react-vite';

import React from 'react';

export type CommonProps = {
  isQuiet?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;

  label?: string;
  labelPosition?: 'top' | 'side';
  labelAlign?: 'start' | 'end';

  isRequired?: boolean;
  necessityIndicator: 'label' | 'icon';

  isInvalid?: boolean;
  errorMessage?: string;

  description?: string;
  contextualHelp?: React.ReactNode;
};

export const allCommonArgTypes: ArgTypes = {
  isQuiet: { control: 'boolean' },
  isDisabled: { control: 'boolean' },
  isReadOnly: { control: 'boolean' },

  label: { control: 'text' },
  labelPosition: { control: 'inline-radio', options: ['top', 'side'] },
  labelAlign: {
    if: { arg: 'labelPosition', eq: 'top' },
    control: 'inline-radio',
    options: ['start', 'end'],
  },

  isRequired: { control: 'boolean' },
  necessityIndicator: {
    if: { arg: 'isRequired', eq: true },
    control: 'inline-radio',
    options: ['label', 'icon'],
  },

  isInvalid: { control: 'boolean' },
  errorMessage: { if: { arg: 'validationState', eq: 'invalid' }, control: 'text' },

  description: { control: 'text' },
  contextualHelp: { control: false },
};
