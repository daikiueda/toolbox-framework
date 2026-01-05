import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { LabeledValue } from '../index';

/**
 * A LabeledValue displays a non-editable children with a label.
 */
const meta: Meta<typeof LabeledValue> = {
  title: 'Components/Status/LabeledValue',
  component: LabeledValue,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    labelPosition: { control: 'radio', options: ['top', 'side'] },
    labelAlign: { control: 'radio', options: ['start', 'end'] },
    children: { control: 'text' },
  },
  args: {
    label: 'Label',
    labelPosition: 'top',
    labelAlign: 'start',
    children: 'Value',
  },
};
export default meta;

export const Basic: StoryObj<typeof LabeledValue> = {
  args: {
    label: 'Name',
    children: 'John Doe',
  },
};

export const SideLabel: StoryObj<typeof LabeledValue> = {
  args: {
    label: 'Status',
    children: 'Active',
    labelPosition: 'side',
  },
};

export const EndAlign: StoryObj<typeof LabeledValue> = {
  args: {
    label: 'Total',
    children: '$1,234.56',
    labelPosition: 'side',
    labelAlign: 'end',
  },
};

export const MultipleValues: StoryObj<typeof LabeledValue> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LabeledValue label="Name">Jane Smith</LabeledValue>
      <LabeledValue label="Email">jane@example.com</LabeledValue>
      <LabeledValue label="Balance">$5,000</LabeledValue>
      <LabeledValue label="Created">June 1, 2024</LabeledValue>
    </div>
  ),
};

export const SideLabels: StoryObj<typeof LabeledValue> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <LabeledValue label="Username" labelPosition="side">
        johndoe
      </LabeledValue>
      <LabeledValue label="Role" labelPosition="side">
        Administrator
      </LabeledValue>
      <LabeledValue label="Last Login" labelPosition="side">
        2024-01-15 10:30
      </LabeledValue>
    </div>
  ),
};
