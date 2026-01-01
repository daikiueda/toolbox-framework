import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { LabeledValue } from './index';

/**
 * A LabeledValue displays a non-editable value with a label.
 * It formats numbers, dates, times, and lists according to the user's locale.
 *
 * https://react-spectrum.adobe.com/react-spectrum/LabeledValue.html
 */
const meta: Meta<typeof LabeledValue> = {
  title: 'Components/Status/LabeledValue',
  component: LabeledValue,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    labelPosition: { control: 'radio', options: ['top', 'side'] },
    labelAlign: { control: 'radio', options: ['start', 'end'] },
  },
  args: {
    label: 'Label',
    labelPosition: 'top',
    labelAlign: 'start',
  },
};
export default meta;

export const StringValue: StoryObj<typeof LabeledValue> = {
  args: {
    label: 'Name',
    value: 'John Doe',
  },
};

export const NumberValue: StoryObj<typeof LabeledValue> = {
  args: {
    label: 'Price',
    value: 1234.56,
    formatOptions: { style: 'currency', currency: 'USD' },
  },
};

export const PercentValue: StoryObj<typeof LabeledValue> = {
  args: {
    label: 'Progress',
    value: 0.75,
    formatOptions: { style: 'percent' },
  },
};

export const DateValue: StoryObj<typeof LabeledValue> = {
  args: {
    label: 'Date',
    value: new Date('2024-01-15'),
    formatOptions: { dateStyle: 'long' },
  },
};

export const ListValue: StoryObj<typeof LabeledValue> = {
  args: {
    label: 'Tags',
    value: ['React', 'TypeScript', 'Storybook'],
    formatOptions: { type: 'conjunction' },
  },
};

export const SideLabel: StoryObj<typeof LabeledValue> = {
  args: {
    label: 'Status',
    value: 'Active',
    labelPosition: 'side',
  },
};

export const MultipleValues: StoryObj<typeof LabeledValue> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LabeledValue label="Name" value="Jane Smith" />
      <LabeledValue label="Email" value="jane@example.com" />
      <LabeledValue
        label="Balance"
        value={5000}
        formatOptions={{ style: 'currency', currency: 'JPY' }}
      />
      <LabeledValue
        label="Created"
        value={new Date('2024-06-01')}
        formatOptions={{ dateStyle: 'medium' }}
      />
    </div>
  ),
};
