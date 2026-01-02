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
    value: { control: 'text' },
    labelPosition: { control: 'radio', options: ['top', 'side'] },
  },
  args: {
    label: 'Label',
    value: 'Value',
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

export const MultipleFields: StoryObj<typeof AsyncLabeledValue> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <AsyncLabeledValue label="Name" value="John Doe" isLoading={false} />
      <AsyncLabeledValue label="Email" value="john@example.com" isLoading={true} />
      <AsyncLabeledValue label="Balance" value="$2,500" isLoading={false} />
      <AsyncLabeledValue label="Last Login" value="2024-01-15" isLoading={true} />
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
