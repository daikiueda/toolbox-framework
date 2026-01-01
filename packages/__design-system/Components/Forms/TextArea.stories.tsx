import { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { TextArea } from './index';
import { allCommonArgTypes } from './storybook-helper/common-props';

const allSpecificArgTypes: ArgTypes = {
  icon: { control: false, description: 'An icon to display at the start of the input.' },

  maxLength: { control: { type: 'number' } },
  minLength: { control: { type: 'number' } },

  enterKeyHint: {
    control: { type: 'select' },
    options: ['enter', 'done', 'go', 'next', 'previous', 'search', 'send'],
  },
};

/**
 * https://react-spectrum.adobe.com/TextArea
 */
const meta: Meta<typeof TextArea> = {
  title: 'Components/Forms/Text Field Family/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof TextArea>;

export const Basic: Story = {
  argTypes: {
    ...allSpecificArgTypes,
    ...allCommonArgTypes,
  },
  args: {
    label: 'Comment',
  },
};

// NOTE: it has not been implemented yet(s2)
// export const WithIcon: Story = {
//   args: {
//     icon: <Edit />,
//   },
//   argTypes: {
//     icon: allSpecificArgTypes.icon,
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
