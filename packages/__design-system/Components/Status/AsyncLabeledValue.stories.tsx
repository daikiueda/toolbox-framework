import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { AsyncLabeledValue } from './index';

/**
 * AsyncLabeledValue is a LabeledValue component that supports loading state.
 * When isLoading is true, it displays a skeleton placeholder instead of the value.
 */
const meta: Meta<typeof AsyncLabeledValue> = {
  title: 'Components/Status/AsyncLabeledValue',
  component: AsyncLabeledValue,
  tags: ['autodocs'],
  argTypes: {
    isLoading: { control: 'boolean' },
    label: { control: 'text' },
    labelPosition: { control: 'radio', options: ['top', 'side'] },
  },
  args: {
    label: 'Label',
    isLoading: false,
    labelPosition: 'top',
  },
};
export default meta;

export const Loaded: StoryObj<typeof AsyncLabeledValue> = {
  args: {
    label: 'Username',
    value: 'johndoe',
    isLoading: false,
  },
};

export const Loading: StoryObj<typeof AsyncLabeledValue> = {
  args: {
    label: 'Username',
    value: 'johndoe',
    isLoading: true,
  },
};

export const WithNumber: StoryObj<typeof AsyncLabeledValue> = {
  args: {
    label: 'Balance',
    value: 1500,
    formatOptions: { style: 'currency', currency: 'USD' },
    isLoading: false,
  },
};

export const WithNumberLoading: StoryObj<typeof AsyncLabeledValue> = {
  args: {
    label: 'Balance',
    value: 1500,
    formatOptions: { style: 'currency', currency: 'USD' },
    isLoading: true,
  },
};

export const MultipleFields: StoryObj<typeof AsyncLabeledValue> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <AsyncLabeledValue label="Name" value="John Doe" isLoading={false} />
      <AsyncLabeledValue label="Email" value="john@example.com" isLoading={true} />
      <AsyncLabeledValue
        label="Account Balance"
        value={2500}
        formatOptions={{ style: 'currency', currency: 'JPY' }}
        isLoading={false}
      />
      <AsyncLabeledValue
        label="Last Login"
        value={new Date()}
        formatOptions={{ dateStyle: 'medium', timeStyle: 'short' }}
        isLoading={true}
      />
    </div>
  ),
};

export const SideLabel: StoryObj<typeof AsyncLabeledValue> = {
  args: {
    label: 'Status',
    value: 'Active',
    labelPosition: 'side',
    isLoading: false,
  },
};

export const SideLabelLoading: StoryObj<typeof AsyncLabeledValue> = {
  args: {
    label: 'Status',
    value: 'Active',
    labelPosition: 'side',
    isLoading: true,
  },
};
