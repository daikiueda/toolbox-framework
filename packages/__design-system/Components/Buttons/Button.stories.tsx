import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from './index';

/**
 * https://react-spectrum.adobe.com/Button
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'accent', 'negative', 'premium', 'genai'],
    },
    fillStyle: { control: 'inline-radio', options: ['fill', 'outline'] },
    size: { control: 'inline-radio', options: ['S', 'M', 'L', 'XL'] },
    isDisabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Button',
    onPress: fn(),
  },
};
export default meta;

export const Basic: StoryObj<typeof Button> = {};
