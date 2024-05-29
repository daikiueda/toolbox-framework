import { Meta, StoryObj } from '@storybook/react';

import { TextField } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/TextField.html
 */
const meta: Meta<typeof TextField> = {
  title: 'Components/Forms/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    isQuiet: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    validationState: { control: 'inline-radio', options: ['valid', 'invalid'] },
    contextualHelp: { control: 'text' },
  },
  args: {
    label: 'Label',
  },
};
export default meta;

export const Basic: StoryObj<typeof TextField> = {};
