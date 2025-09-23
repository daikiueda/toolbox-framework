import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { Divider, Text } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/Divider.html
 */
const meta: Meta<typeof Divider> = {
  title: 'Components/Content/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: { type: 'select' },
      options: ['S', 'M', 'L'],
    },
  },
  args: {
    orientation: 'horizontal',
    size: 'M',
  },
};

type Story = StoryObj<typeof Divider>;

export default meta;

export const Basic: Story = {
  render: (args) => (
    <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Text>Content above divider</Text>
      <Divider {...args} />
      <Text>Content below divider</Text>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '100px' }}>
      <Text>Left content</Text>
      <Divider {...args} />
      <Text>Right content</Text>
    </div>
  ),
};

export const SizeS: Story = {
  args: {
    size: 'S',
  },
  render: (args) => (
    <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Text>Content above divider</Text>
      <Divider {...args} />
      <Text>Content below divider</Text>
    </div>
  ),
};

export const SizeL: Story = {
  args: {
    size: 'L',
  },
  render: (args) => (
    <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Text>Content above divider</Text>
      <Divider {...args} />
      <Text>Content below divider</Text>
    </div>
  ),
};

export const InLayout: Story = {
  render: (args) => (
    <div style={{ width: '400px', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <Text>Section 1</Text>
      <p>This is some content in the first section.</p>
      <Divider {...args} />
      <Text>Section 2</Text>
      <p>This is some content in the second section.</p>
      <Divider {...args} />
      <Text>Section 3</Text>
      <p>This is some content in the third section.</p>
    </div>
  ),
};
