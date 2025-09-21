import { Meta, StoryObj } from '@storybook/react-vite';

import { Well } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/Well.html
 */
const meta: Meta<typeof Well> = {
  title: 'Components/Content/Well',
  component: Well,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
  },
  args: {
    children: 'This is content inside a well.',
  },
};
export default meta;

export const Basic: StoryObj<typeof Well> = {};

export const LongContent: StoryObj<typeof Well> = {
  args: {
    children:
      'This is a longer piece of content inside a well. Wells are used to group related content and provide visual separation from the surrounding elements. They create a subtle background that helps organize information.',
  },
};
