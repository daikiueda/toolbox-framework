import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { LabeledValue } from './index';

/**
 * A LabeledValue displays a non-editable value with a label.
 */
const meta: Meta<typeof LabeledValue> = {
  title: 'Components/Status/LabeledValue',
  component: LabeledValue,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    labelPosition: { control: 'radio', options: ['top', 'side'] },
    labelAlign: { control: 'radio', options: ['start', 'end'] },
  },
  args: {
    label: 'Label',
    value: 'Value',
    labelPosition: 'top',
    labelAlign: 'start',
  },
};
export default meta;

export const Basic: StoryObj<typeof LabeledValue> = {
  args: {
    label: 'Name',
    value: 'John Doe',
  },
};

export const SideLabel: StoryObj<typeof LabeledValue> = {
  args: {
    label: 'Status',
    value: 'Active',
    labelPosition: 'side',
  },
};

export const EndAlign: StoryObj<typeof LabeledValue> = {
  args: {
    label: 'Total',
    value: '$1,234.56',
    labelPosition: 'side',
    labelAlign: 'end',
  },
};

export const MultipleValues: StoryObj<typeof LabeledValue> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LabeledValue label="Name" value="Jane Smith" />
      <LabeledValue label="Email" value="jane@example.com" />
      <LabeledValue label="Balance" value="$5,000" />
      <LabeledValue label="Created" value="June 1, 2024" />
    </div>
  ),
};

export const SideLabels: StoryObj<typeof LabeledValue> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <LabeledValue label="Username" value="johndoe" labelPosition="side" />
      <LabeledValue label="Role" value="Administrator" labelPosition="side" />
      <LabeledValue label="Last Login" value="2024-01-15 10:30" labelPosition="side" />
    </div>
  ),
};
