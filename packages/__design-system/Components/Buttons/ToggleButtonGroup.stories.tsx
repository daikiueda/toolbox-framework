import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { ToggleButton, ToggleButtonGroup } from './index';

/**
 * https://react-spectrum.adobe.com/ToggleButtonGroup
 */
const meta: Meta<typeof ToggleButtonGroup> = {
  title: 'Components/Buttons/ToggleButtonGroup',
  component: ToggleButtonGroup,
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
    selectionMode: undefined,
    orientation: 'horizontal',
    isQuiet: false,
    isDisabled: false,
    density: 'regular',
  },
};

type Story = StoryObj<typeof ToggleButtonGroup>;

export default meta;

export const Basic: Story = {
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton key="edit">Edit</ToggleButton>
      <ToggleButton key="copy">Copy</ToggleButton>
      <ToggleButton key="delete">Delete</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const SingleSelection: Story = {
  args: {
    selectionMode: 'single',
  },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton key="left">Left</ToggleButton>
      <ToggleButton key="center">Center</ToggleButton>
      <ToggleButton key="right">Right</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const MultipleSelection: Story = {
  args: {
    selectionMode: 'multiple',
  },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton key="bold">Bold</ToggleButton>
      <ToggleButton key="italic">Italic</ToggleButton>
      <ToggleButton key="underline">Underline</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    selectionMode: 'single',
  },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton key="top">Top</ToggleButton>
      <ToggleButton key="middle">Middle</ToggleButton>
      <ToggleButton key="bottom">Bottom</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const Quiet: Story = {
  args: {
    isQuiet: true,
    selectionMode: 'single',
  },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton key="grid">Grid</ToggleButton>
      <ToggleButton key="list">List</ToggleButton>
      <ToggleButton key="card">Card</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton key="edit">Edit</ToggleButton>
      <ToggleButton key="copy">Copy</ToggleButton>
      <ToggleButton key="delete">Delete</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const Compact: Story = {
  args: {
    density: 'compact',
    selectionMode: 'single',
  },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton key="small">Small</ToggleButton>
      <ToggleButton key="medium">Medium</ToggleButton>
      <ToggleButton key="large">Large</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const WithDefaultSelection: Story = {
  args: {
    selectionMode: 'single',
    defaultSelectedKeys: ['center'],
  },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton key="left">Left</ToggleButton>
      <ToggleButton key="center">Center</ToggleButton>
      <ToggleButton key="right">Right</ToggleButton>
    </ToggleButtonGroup>
  ),
};
