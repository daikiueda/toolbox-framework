import { Text } from './index';

import { Meta, StoryObj } from '@storybook/react';

/**
 * https://react-spectrum.adobe.com/react-spectrum/Text.html
 */
const meta: Meta<typeof Text> = {
  title: 'Components/Content/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
  },
  args: {
    children: 'Text',
  },
};
export default meta;

export const Basic: StoryObj<typeof Text> = {};
