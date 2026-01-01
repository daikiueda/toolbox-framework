import { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { NumberField } from './index';
import { allCommonArgTypes } from './storybook-helper/common-props';

const allSpecificArgTypes: ArgTypes = {
  minValue: { control: { type: 'number' } },
  maxValue: { control: { type: 'number' } },

  step: { control: { type: 'number' } },

  formatOptions: {
    control: { type: 'object' },
    description:
      '[Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat)',
  },

  hideStepper: { control: { type: 'boolean' } },
  isWheelDisabled: { control: { type: 'boolean' } },
};

/**
 * https://react-spectrum.adobe.com/NumberField
 */
const meta: Meta<typeof NumberField> = {
  title: 'Components/Forms/Text Field Family/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof NumberField>;

export const Basic: Story = {
  argTypes: {
    ...allSpecificArgTypes,
    ...allCommonArgTypes,
  },
};

export const WithMinMax: Story = {
  args: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 50,
    description: 'Enter a number between 0 and 100',
  },
};

export const WithStep: Story = {
  args: {
    step: 0.5,
    defaultValue: 2.5,
    formatOptions: {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
    description: 'Increments by 0.5',
  },
};

export const Currency: Story = {
  args: {
    label: 'Price',
    formatOptions: {
      style: 'currency',
      currency: 'USD',
    },
    defaultValue: 10.99,
  },
};

export const Percentage: Story = {
  args: {
    label: 'Percentage',
    formatOptions: { style: 'percent' },
    defaultValue: 0.15,
    step: 0.01,
  },
};

export const HiddenStepper: Story = {
  args: {
    hideStepper: true,
    defaultValue: 100,
    description: 'Stepper buttons are hidden',
  },
};
