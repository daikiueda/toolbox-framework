import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import React from 'react';

import Add from '@react-spectrum/s2/icons/Add';
import Edit from '@react-spectrum/s2/icons/Edit';

import { Text, View } from './../../index';
import { ActionButton } from './index';

/**
 * https://react-spectrum.adobe.com/ActionButton
 */
const meta: Meta<typeof ActionButton> = {
  title: 'Components/Buttons/ActionButton',
  component: ActionButton,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['XS', 'S', 'M', 'L', 'XL'] },
    isQuiet: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    onPress: fn(),
  },
};
export default meta;

export const Basic: StoryObj<typeof ActionButton> = {
  args: {
    children: 'Action',
  },
};

export const Quiet: StoryObj<typeof ActionButton> = {
  argTypes: { isQuiet: { control: false }, children: { control: false } },
  args: {
    isQuiet: true,
    children: 'Action',
  },
};

export const WithIcon: StoryObj<typeof ActionButton> = {
  argTypes: { children: { control: false } },
  args: {
    children: (
      <>
        <Add />
        <Text>Add Item</Text>
      </>
    ),
  },
};

export const IconOnly: StoryObj<typeof ActionButton> = {
  argTypes: { children: { control: false } },
  args: {
    'aria-label': 'Edit',
    children: <Edit />,
  },
};

export const Disabled: StoryObj<typeof ActionButton> = {
  argTypes: { isDisabled: { control: false } },
  args: {
    isDisabled: true,
    children: 'Disabled Action',
  },
};

export const StaticColor: StoryObj<typeof ActionButton> = {
  argTypes: {
    staticColor: {
      control: 'inline-radio',
      options: ['white', 'black'],
    },
    isQuiet: { control: false },
    children: { control: false },
  },
  args: {
    staticColor: 'white',
    isQuiet: true,
  },
  render: (args) => (
    <View backgroundColor={args.staticColor === 'white' ? 'blue-400' : 'transparent'}>
      <ActionButton {...args}>
        <Add />
        <Text>Add Item</Text>
      </ActionButton>
    </View>
  ),
};
