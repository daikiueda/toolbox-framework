import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { NumberField } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/NumberField.html
 */
const meta: Meta<typeof NumberField> = {
  title: 'Components/Forms/NumberField',
  component: NumberField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    formatOptions: {
      control: { type: 'object' },
    },
    isQuiet: {
      control: { type: 'boolean' },
    },
    isDisabled: {
      control: { type: 'boolean' },
    },
    isReadOnly: {
      control: { type: 'boolean' },
    },
    isRequired: {
      control: { type: 'boolean' },
    },
    hideStepper: {
      control: { type: 'boolean' },
    },
    minValue: {
      control: { type: 'number' },
    },
    maxValue: {
      control: { type: 'number' },
    },
    step: {
      control: { type: 'number' },
    },
  },
  args: {
    label: 'Number',
    isQuiet: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    hideStepper: false,
  },
};

type Story = StoryObj<typeof NumberField>;

export default meta;

export const Basic: Story = {
  render: (args) => <NumberField {...args} />,
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 42,
  },
  render: (args) => <NumberField {...args} />,
};

export const WithMinMax: Story = {
  args: {
    minValue: 0,
    maxValue: 100,
    defaultValue: 50,
    description: 'Enter a number between 0 and 100',
  },
  render: (args) => <NumberField {...args} />,
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
  render: (args) => <NumberField {...args} />,
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
  render: (args) => <NumberField {...args} />,
};

export const Percentage: Story = {
  args: {
    label: 'Percentage',
    formatOptions: {
      style: 'percent',
    },
    defaultValue: 0.15,
    step: 0.01,
  },
  render: (args) => <NumberField {...args} />,
};

export const Required: Story = {
  args: {
    isRequired: true,
  },
  render: (args) => <NumberField {...args} />,
};

export const WithValidation: Story = {
  args: {
    isRequired: true,
    validationState: 'invalid',
    errorMessage: 'Please enter a valid number',
  },
  render: (args) => <NumberField {...args} />,
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    defaultValue: 123,
  },
  render: (args) => <NumberField {...args} />,
};

export const ReadOnly: Story = {
  args: {
    isReadOnly: true,
    defaultValue: 456,
  },
  render: (args) => <NumberField {...args} />,
};

export const Quiet: Story = {
  args: {
    isQuiet: true,
    defaultValue: 789,
  },
  render: (args) => <NumberField {...args} />,
};

export const HiddenStepper: Story = {
  args: {
    hideStepper: true,
    defaultValue: 100,
    description: 'Stepper buttons are hidden',
  },
  render: (args) => <NumberField {...args} />,
};

export const WithDescription: Story = {
  args: {
    description: 'This is a helpful description for the number field',
    defaultValue: 50,
  },
  render: (args) => <NumberField {...args} />,
};
