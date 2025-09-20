import { Meta, StoryObj } from '@storybook/react-vite';

import { Heading } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/Heading.html
 */
const meta: Meta<typeof Heading> = {
  title: 'Components/Content/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    level: { control: { type: 'number', min: 1, max: 6 } },
    children: { control: 'text' },
  },
  args: {
    level: 3,
    children: 'Heading',
  },
};
export default meta;

export const Basic: StoryObj<typeof Heading> = {};
