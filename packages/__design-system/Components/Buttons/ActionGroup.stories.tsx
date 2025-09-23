import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { ActionGroup, ActionGroupItem } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/ActionGroup.html
 */
const meta: Meta<typeof ActionGroup> = {
  title: 'Components/Buttons/ActionGroup',
  component: ActionGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      control: { type: 'select' },
      options: ['none', 'single', 'multiple'],
    },
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
    selectionMode: 'none',
    orientation: 'horizontal',
    isQuiet: false,
    isDisabled: false,
    density: 'regular',
  },
};

type Story = StoryObj<typeof ActionGroup>;

export default meta;

export const Basic: Story = {
  render: (args) => (
    <ActionGroup {...args}>
      <ActionGroupItem key="edit">Edit</ActionGroupItem>
      <ActionGroupItem key="copy">Copy</ActionGroupItem>
      <ActionGroupItem key="delete">Delete</ActionGroupItem>
    </ActionGroup>
  ),
};

export const SingleSelection: Story = {
  args: {
    selectionMode: 'single',
  },
  render: (args) => (
    <ActionGroup {...args}>
      <ActionGroupItem key="left">Left</ActionGroupItem>
      <ActionGroupItem key="center">Center</ActionGroupItem>
      <ActionGroupItem key="right">Right</ActionGroupItem>
    </ActionGroup>
  ),
};

export const MultipleSelection: Story = {
  args: {
    selectionMode: 'multiple',
  },
  render: (args) => (
    <ActionGroup {...args}>
      <ActionGroupItem key="bold">Bold</ActionGroupItem>
      <ActionGroupItem key="italic">Italic</ActionGroupItem>
      <ActionGroupItem key="underline">Underline</ActionGroupItem>
    </ActionGroup>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    selectionMode: 'single',
  },
  render: (args) => (
    <ActionGroup {...args}>
      <ActionGroupItem key="top">Top</ActionGroupItem>
      <ActionGroupItem key="middle">Middle</ActionGroupItem>
      <ActionGroupItem key="bottom">Bottom</ActionGroupItem>
    </ActionGroup>
  ),
};

export const Quiet: Story = {
  args: {
    isQuiet: true,
    selectionMode: 'single',
  },
  render: (args) => (
    <ActionGroup {...args}>
      <ActionGroupItem key="grid">Grid</ActionGroupItem>
      <ActionGroupItem key="list">List</ActionGroupItem>
      <ActionGroupItem key="card">Card</ActionGroupItem>
    </ActionGroup>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <ActionGroup {...args}>
      <ActionGroupItem key="edit">Edit</ActionGroupItem>
      <ActionGroupItem key="copy">Copy</ActionGroupItem>
      <ActionGroupItem key="delete">Delete</ActionGroupItem>
    </ActionGroup>
  ),
};

export const Compact: Story = {
  args: {
    density: 'compact',
    selectionMode: 'single',
  },
  render: (args) => (
    <ActionGroup {...args}>
      <ActionGroupItem key="small">Small</ActionGroupItem>
      <ActionGroupItem key="medium">Medium</ActionGroupItem>
      <ActionGroupItem key="large">Large</ActionGroupItem>
    </ActionGroup>
  ),
};

export const WithDefaultSelection: Story = {
  args: {
    selectionMode: 'single',
    defaultSelectedKeys: ['center'],
  },
  render: (args) => (
    <ActionGroup {...args}>
      <ActionGroupItem key="left">Left</ActionGroupItem>
      <ActionGroupItem key="center">Center</ActionGroupItem>
      <ActionGroupItem key="right">Right</ActionGroupItem>
    </ActionGroup>
  ),
};
