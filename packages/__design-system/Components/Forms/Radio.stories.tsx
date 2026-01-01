import { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import React from 'react';

import { Radio, RadioGroup } from './index';
import { allCommonArgTypes } from './storybook-helper/common-props';

const allSpecificArgTypes: ArgTypes = {
  orientation: { control: { type: 'inline-radio' }, options: ['horizontal', 'vertical'] },

  isEmphasized: { control: 'boolean' },
};

/**
 * https://react-spectrum.adobe.com/RadioGroup
 */
const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="dogs">Dogs</Radio>
      <Radio value="cats">Cats</Radio>
      <Radio value="dragons">Dragons</Radio>
    </RadioGroup>
  ),
  argTypes: {
    defaultValue: { control: false },
  },
  args: {
    defaultValue: 'dogs',
    onChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Basic: Story = {
  argTypes: {
    ...allSpecificArgTypes,
    ...allCommonArgTypes,
  },
  args: {
    label: 'Favorite pet',
  },
};

export const Emphasized: Story = {
  argTypes: {
    isEmphasized: allSpecificArgTypes.isEmphasized,
  },
  args: {
    label: 'Favorite pet',
    isEmphasized: true,
  },
};

export const Horizontal: Story = {
  argTypes: {
    orientation: allSpecificArgTypes.orientation,
  },
  args: {
    orientation: 'horizontal',
  },
};
