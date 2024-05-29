import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/Button.html
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['accent', 'primary', 'secondary', 'negative'] },
    style: { control: 'inline-radio', options: ['fill', 'outline'] },
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
