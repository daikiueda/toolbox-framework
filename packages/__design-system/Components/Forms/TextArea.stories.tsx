import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { TextArea } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/TextArea.html
 */
const meta: Meta<typeof TextArea> = {
  title: 'Components/Forms/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    description: {
      control: { type: 'text' },
    },
    errorMessage: {
      control: { type: 'text' },
    },
    isQuiet: {
      control: { type: 'boolean' },
    },
    isDisabled: {
      control: { type: 'boolean' },
    },
    isReadOnly: {
      control: { type: 'boolean' },
    },
    isRequired: {
      control: { type: 'boolean' },
    },
    autoFocus: {
      control: { type: 'boolean' },
    },
    validationState: {
      control: { type: 'inline-radio' },
      options: ['valid', 'invalid'],
    },
    validationBehavior: {
      control: { type: 'inline-radio' },
      options: ['aria', 'native'],
    },
    maxLength: {
      control: { type: 'number' },
    },
    minLength: {
      control: { type: 'number' },
    },
    inputMode: {
      control: { type: 'select' },
      options: ['none', 'text', 'tel', 'url', 'email', 'numeric', 'decimal', 'search'],
    },
    enterKeyHint: {
      control: { type: 'select' },
      options: ['enter', 'done', 'go', 'next', 'previous', 'search', 'send'],
    },
    autoComplete: {
      control: { type: 'text' },
    },
    name: {
      control: { type: 'text' },
    },
  },
  args: {
    label: 'Comment',
    onChange: fn(),
    isQuiet: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    autoFocus: false,
  },
};

type Story = StoryObj<typeof TextArea>;

export default meta;

export const Basic: Story = {};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'This is a sample text.\nMultiple lines are supported.',
  },
};

export const WithDescription: Story = {
  args: {
    description: 'Please provide detailed feedback about your experience.',
  },
};

export const Required: Story = {
  argTypes: {
    isRequired: { control: false },
  },
  args: {
    isRequired: true,
  },
};

export const WithValidation: Story = {
  argTypes: {
    validationState: { control: false },
  },
  args: {
    isRequired: true,
    validationState: 'invalid',
    errorMessage: 'Please enter a comment',
  },
};

export const Valid: Story = {
  argTypes: {
    validationState: { control: false },
  },
  args: {
    validationState: 'valid',
    defaultValue: 'This is a valid comment.',
  },
};

export const Disabled: Story = {
  argTypes: {
    isDisabled: { control: false },
  },
  args: {
    isDisabled: true,
    defaultValue: 'This text area is disabled.',
  },
};

export const ReadOnly: Story = {
  argTypes: {
    isReadOnly: { control: false },
  },
  args: {
    isReadOnly: true,
    defaultValue: 'This text area is read-only.',
  },
};

export const Quiet: Story = {
  argTypes: {
    isQuiet: { control: false },
  },
  args: {
    isQuiet: true,
    defaultValue: 'Quiet style text area.',
  },
};

export const WithMaxLength: Story = {
  args: {
    maxLength: 100,
    description: 'Maximum 100 characters allowed',
    defaultValue: 'This text area has a maximum length constraint.',
  },
};

export const WithMinLength: Story = {
  args: {
    minLength: 10,
    description: 'Minimum 10 characters required',
    isRequired: true,
  },
};

export const WithInputMode: Story = {
  args: {
    inputMode: 'email',
    label: 'Email addresses',
    description: 'Optimized for email input on mobile devices',
  },
};

export const WithEnterKeyHint: Story = {
  args: {
    enterKeyHint: 'send',
    label: 'Message',
    description: 'Press Enter to send on mobile keyboards',
  },
};
