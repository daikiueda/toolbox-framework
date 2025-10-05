import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import React from 'react';

import { Radio, RadioGroup } from './index';

const pets = [
  { value: 'dogs', label: 'Dogs' },
  { value: 'cats', label: 'Cats' },
  { value: 'dragons', label: 'Dragons' },
];

const sizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const officeSnacks = [
  { value: 'fruit', label: 'Fruit' },
  { value: 'chips', label: 'Chips' },
  { value: 'nuts', label: 'Nuts' },
];

const notificationCadence = [
  { value: 'instant', label: 'Instant' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly summary' },
];

const renderRadios = (
  args: React.ComponentProps<typeof RadioGroup>,
  items: Array<{ value: string; label: string }>
) => (
  <RadioGroup {...args}>
    {items.map(({ value, label }) => (
      <Radio key={value} value={value}>
        {label}
      </Radio>
    ))}
  </RadioGroup>
);

/**
 * https://react-spectrum.adobe.com/react-spectrum/RadioGroup.html
 */
const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: { type: 'inline-radio' }, options: ['horizontal', 'vertical'] },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isEmphasized: { control: 'boolean' },
    showErrorIcon: { control: 'boolean' },
    labelPosition: { control: { type: 'inline-radio' }, options: ['top', 'side'] },
    labelAlign: { control: { type: 'inline-radio' }, options: ['start', 'end'] },
    necessityIndicator: { control: { type: 'inline-radio' }, options: ['icon', 'label', 'none'] },
    validationBehavior: { control: { type: 'inline-radio' }, options: ['aria', 'native'] },
    isInvalid: { control: 'boolean' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
    name: { control: 'text' },
    value: { control: 'text' },
    defaultValue: { control: 'text' },
  },
  args: {
    label: 'Favorite pet',
    orientation: 'vertical',
    name: 'favorite-pet',
    onChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Basic: Story = {
  render: (args) => renderRadios(args, pets),
};

export const Horizontal: Story = {
  argTypes: {
    orientation: { control: false },
  },
  args: {
    orientation: 'horizontal',
  },
  render: (args) => renderRadios(args, sizes),
};

export const SideLabel: Story = {
  argTypes: {
    labelPosition: { control: false },
  },
  args: {
    label: 'Desk location',
    labelPosition: 'side',
    labelAlign: 'start',
    description: 'Choose the desk closest to your teammates.',
  },
  render: (args) =>
    renderRadios(
      args,
      ['A', 'B', 'C'].map((value) => ({ value, label: `Area ${value}` }))
    ),
};

export const Required: Story = {
  args: {
    label: 'Preferred office snack',
    isRequired: true,
    necessityIndicator: 'label',
    description: 'This helps us restock appropriately.',
  },
  render: (args) => renderRadios(args, officeSnacks),
};

export const Invalid: Story = {
  argTypes: {
    isInvalid: { control: false },
  },
  args: {
    label: 'Team lunch option',
    isInvalid: true,
    errorMessage: 'Select one of the available options.',
    showErrorIcon: true,
  },
  render: (args) =>
    renderRadios(args, [
      { value: 'pizza', label: 'Pizza' },
      { value: 'sushi', label: 'Sushi' },
      { value: 'salad', label: 'Salad' },
    ]),
};

export const Emphasized: Story = {
  argTypes: {
    isEmphasized: { control: false },
  },
  args: {
    label: 'Notification cadence',
    isEmphasized: true,
    description: 'Highlight important selection for new teammates.',
    defaultValue: 'daily',
  },
  render: (args) => renderRadios(args, notificationCadence),
};

export const ReadOnly: Story = {
  argTypes: {
    isReadOnly: { control: false },
  },
  args: {
    label: 'Assigned region',
    isReadOnly: true,
    value: 'east',
  },
  render: (args) =>
    renderRadios(args, [
      { value: 'north', label: 'North' },
      { value: 'east', label: 'East' },
      { value: 'west', label: 'West' },
    ]),
};
