import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { ActionButton, ActionButtonGroup } from './index';

/**
 * https://react-spectrum.adobe.com/ActionButtonGroup
 */
const meta: Meta<typeof ActionButtonGroup> = {
  title: 'Components/Buttons/ActionButtonGroup',
  component: ActionButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    isQuiet: {
      control: { type: 'boolean' },
    },
    isDisabled: {
      control: { type: 'boolean' },
    },
    density: {
      control: { type: 'select' },
      options: ['compact', 'regular'],
    },
  },
  args: {
    orientation: 'horizontal',
    isQuiet: false,
    isDisabled: false,
    density: 'regular',
  },
};

type Story = StoryObj<typeof ActionButtonGroup>;

export default meta;

export const Basic: Story = {
  render: (args) => (
    <ActionButtonGroup {...args}>
      <ActionButton key="edit">Edit</ActionButton>
      <ActionButton key="copy">Copy</ActionButton>
      <ActionButton key="delete">Delete</ActionButton>
    </ActionButtonGroup>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <ActionButtonGroup {...args}>
      <ActionButton key="top">Top</ActionButton>
      <ActionButton key="middle">Middle</ActionButton>
      <ActionButton key="bottom">Bottom</ActionButton>
    </ActionButtonGroup>
  ),
};

export const Quiet: Story = {
  args: {
    isQuiet: true,
  },
  render: (args) => (
    <ActionButtonGroup {...args}>
      <ActionButton key="grid">Grid</ActionButton>
      <ActionButton key="list">List</ActionButton>
      <ActionButton key="card">Card</ActionButton>
    </ActionButtonGroup>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <ActionButtonGroup {...args}>
      <ActionButton key="edit">Edit</ActionButton>
      <ActionButton key="copy">Copy</ActionButton>
      <ActionButton key="delete">Delete</ActionButton>
    </ActionButtonGroup>
  ),
};

export const Compact: Story = {
  args: {
    density: 'compact',
  },
  render: (args) => (
    <ActionButtonGroup {...args}>
      <ActionButton key="small">Small</ActionButton>
      <ActionButton key="medium">Medium</ActionButton>
      <ActionButton key="large">Large</ActionButton>
    </ActionButtonGroup>
  ),
};
