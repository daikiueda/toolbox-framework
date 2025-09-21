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
    isSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Enable notifications',
    onChange: fn(),
  },
};
export default meta;

export const Basic: StoryObj<typeof Switch> = {};

export const Selected: StoryObj<typeof Switch> = {
  args: {
    isSelected: true,
  },
};

export const Disabled: StoryObj<typeof Switch> = {
  args: {
    isDisabled: true,
  },
};

export const DisabledSelected: StoryObj<typeof Switch> = {
  args: {
    isDisabled: true,
    isSelected: true,
  },
};

export const ReadOnly: StoryObj<typeof Switch> = {
  args: {
    isReadOnly: true,
    isSelected: true,
  },
};
