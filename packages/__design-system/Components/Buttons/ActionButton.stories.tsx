import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import Add from '@spectrum-icons/workflow/Add';
import Delete from '@spectrum-icons/workflow/Delete';
import Edit from '@spectrum-icons/workflow/Edit';

import { ActionButton } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/ActionButton.html
 */
const meta: Meta<typeof ActionButton> = {
  title: 'Components/Buttons/ActionButton',
  component: ActionButton,
  tags: ['autodocs'],
  argTypes: {
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

export const WithIcon: StoryObj<typeof ActionButton> = {
  args: {
    children: (
      <>
        <Add />
        Add Item
      </>
    ),
  },
};

export const IconOnly: StoryObj<typeof ActionButton> = {
  args: {
    'aria-label': 'Edit',
    children: <Edit />,
  },
};

export const Quiet: StoryObj<typeof ActionButton> = {
  args: {
    isQuiet: true,
    children: (
      <>
        <Delete />
        Delete
      </>
    ),
  },
};

export const Disabled: StoryObj<typeof ActionButton> = {
  args: {
    isDisabled: true,
    children: 'Disabled Action',
  },
};
