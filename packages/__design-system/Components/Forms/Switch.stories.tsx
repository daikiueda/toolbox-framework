import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Switch } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/Switch.html
 */
const meta: Meta<typeof Switch> = {
  title: 'Components/Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    isEmphasized: { control: 'boolean' },
    isSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Enable notifications',
    onChange: fn(),
    isEmphasized: false,
    isSelected: false,
    isDisabled: false,
    isReadOnly: false,
  },
};
export default meta;

export const Basic: StoryObj<typeof Switch> = {
  name: 'Basic (Quiet)',
  args: {
    isSelected: true,
  },
};

export const Emphasized: StoryObj<typeof Switch> = {
  argTypes: {
    isEmphasized: { control: false },
  },
  args: {
    isEmphasized: true,
    isSelected: true,
  },
};

export const Selected: StoryObj<typeof Switch> = {
  argTypes: {
    isSelected: { control: false },
  },
  args: {
    isSelected: true,
  },
};

export const Disabled: StoryObj<typeof Switch> = {
  argTypes: {
    isDisabled: { control: false },
  },
  args: {
    isDisabled: true,
  },
};

export const ReadOnly: StoryObj<typeof Switch> = {
  argTypes: {
    isReadOnly: { control: false },
  },
  args: {
    isReadOnly: true,
  },
};
