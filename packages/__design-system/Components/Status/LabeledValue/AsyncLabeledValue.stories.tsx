import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { AsyncLabeledValue } from '../index';

/**
 * AsyncLabeledValue is a LabeledValue component that supports loading state.
 * When isLoading is true, it displays a skeleton placeholder instead of the value.
 */
const meta: Meta<typeof AsyncLabeledValue> = {
  title: 'Components/Status/LabeledValue/AsyncLabeledValue',
  component: AsyncLabeledValue,
  tags: ['autodocs'],
  argTypes: {
    isLoading: { control: 'boolean' },
    label: { control: 'text' },
    labelPosition: { control: 'radio', options: ['top', 'side'] },
    children: { control: 'text' },
  },
  args: {
    label: 'Label',
    isLoading: false,
    labelPosition: 'top',
    children: 'Value',
  },
};
export default meta;

export const Loaded: StoryObj<typeof AsyncLabeledValue> = {
  args: {
    label: 'Username',
    children: 'johndoe',
    isLoading: false,
  },
};

export const Loading: StoryObj<typeof AsyncLabeledValue> = {
  args: {
    label: 'Username',
    children: 'johndoe',
    isLoading: true,
  },
};

export const MultipleFields: StoryObj<typeof AsyncLabeledValue> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <AsyncLabeledValue label="Name" isLoading={false}>
        John Doe
      </AsyncLabeledValue>
      <AsyncLabeledValue label="Email" isLoading={true}>
        john@example.com
      </AsyncLabeledValue>
      <AsyncLabeledValue label="Balance" isLoading={false}>
        $2,500
      </AsyncLabeledValue>
      <AsyncLabeledValue label="Last Login" isLoading={true}>
        2024-01-15
      </AsyncLabeledValue>
    </div>
  ),
};

export const SideLabel: StoryObj<typeof AsyncLabeledValue> = {
  args: {
    label: 'Status',
    children: 'Active',
    labelPosition: 'side',
    isLoading: false,
  },
};

export const SideLabelLoading: StoryObj<typeof AsyncLabeledValue> = {
  args: {
    label: 'Status',
    children: 'Active',
    labelPosition: 'side',
    isLoading: true,
  },
};
