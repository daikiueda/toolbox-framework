import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Radio, RadioGroup } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/RadioGroup.html
 */
const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    validationState: { control: 'inline-radio', options: ['valid', 'invalid'] },
    value: { control: 'text' },
  },
  args: {
    label: 'Favorite pet',
    onChange: fn(),
  },
};
export default meta;

export const Basic: StoryObj<typeof RadioGroup> = {
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="dogs">Dogs</Radio>
      <Radio value="cats">Cats</Radio>
      <Radio value="dragons">Dragons</Radio>
    </RadioGroup>
  ),
};

export const Horizontal: StoryObj<typeof RadioGroup> = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="small">Small</Radio>
      <Radio value="medium">Medium</Radio>
      <Radio value="large">Large</Radio>
    </RadioGroup>
  ),
};

export const WithDefaultValue: StoryObj<typeof RadioGroup> = {
  args: {
    value: 'cats',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="dogs">Dogs</Radio>
      <Radio value="cats">Cats</Radio>
      <Radio value="dragons">Dragons</Radio>
    </RadioGroup>
  ),
};

export const WithValidation: StoryObj<typeof RadioGroup> = {
  args: {
    isRequired: true,
    validationState: 'invalid',
    errorMessage: 'Please select an option',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="option1">Option 1</Radio>
      <Radio value="option2">Option 2</Radio>
      <Radio value="option3">Option 3</Radio>
    </RadioGroup>
  ),
};

export const Disabled: StoryObj<typeof RadioGroup> = {
  args: {
    isDisabled: true,
    value: 'option2',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="option1">Option 1</Radio>
      <Radio value="option2">Option 2</Radio>
      <Radio value="option3">Option 3</Radio>
    </RadioGroup>
  ),
};

export const ReadOnly: StoryObj<typeof RadioGroup> = {
  args: {
    isReadOnly: true,
    value: 'option2',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="option1">Option 1</Radio>
      <Radio value="option2">Option 2</Radio>
      <Radio value="option3">Option 3</Radio>
    </RadioGroup>
  ),
};
