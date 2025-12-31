import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { Button, ButtonGroup } from './index';

/**
 * https://react-spectrum.adobe.com/ButtonGroup
 */
const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/Buttons/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    isDisabled: { control: 'boolean' },
  },
  args: {
    orientation: 'horizontal',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

const sampleButtons = (
  <>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="accent">Accent</Button>
  </>
);

export const Basic: Story = {
  render: (props) => <ButtonGroup {...props}>{sampleButtons}</ButtonGroup>,
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical" align="start">
      {sampleButtons}
    </ButtonGroup>
  ),
};

export const Disabled: Story = {
  render: () => <ButtonGroup isDisabled>{sampleButtons}</ButtonGroup>,
};

export const MixedVariants: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Duplicate</Button>
      <Button variant="negative">Delete</Button>
    </ButtonGroup>
  ),
};
