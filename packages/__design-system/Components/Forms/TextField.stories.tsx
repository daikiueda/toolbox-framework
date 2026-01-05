import { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { TextField } from './index';
import { allCommonArgTypes } from './storybook-helper/common-props';

const allSpecificArgTypes: ArgTypes = {
  icon: { control: false, description: 'An icon to display at the start of the input.' },
};

/**
 * https://react-spectrum.adobe.com/TextField
 */
const meta: Meta<typeof TextField> = {
  title: 'Components/Forms/Text Field Family/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof TextField>;

export const Basic: Story = {
  args: {
    label: 'Label',
  },
  argTypes: {
    ...allSpecificArgTypes,
    ...allCommonArgTypes,
  },
};

// NOTE: it has not been implemented yet(s2)
// export const WithIcon: Story = {
//   args: {
//     label: 'With icon',
//     icon: <Edit />,
//   },
// };

export const WithMaxLength: Story = {
  args: {
    maxLength: 100,
    description: 'Maximum 100 characters allowed',
    defaultValue: 'This text area has a maximum length constraint.',
  },
  argTypes: {
    description: { control: false },
    defaultValue: { control: false },
  },
};
