import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import React from 'react';

import { Button } from '../Buttons';

import { Form, TextField } from './index';

/**
 * https://react-spectrum.adobe.com/react-spectrum/Form.html
 */
const meta: Meta<typeof Form> = {
  title: 'Components/Forms/Form',
  component: Form,
  tags: ['autodocs'],
  argTypes: {
    isQuiet: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    validationState: { control: 'inline-radio', options: ['valid', 'invalid'] },
  },
  args: {
    onSubmit: fn(),
  },
};
export default meta;

export const Basic: StoryObj<typeof Form> = {
  render: (args) => (
    <Form {...args}>
      <TextField label="Name" />
      <TextField label="Email" type="email" />
      <Button variant="accent" type="submit">
        Submit
      </Button>
    </Form>
  ),
};

export const WithValidation: StoryObj<typeof Form> = {
  args: {
    validationState: 'invalid',
  },
  render: (args) => (
    <Form {...args}>
      <TextField label="Name" isRequired isInvalid errorMessage="Name is required" />
      <TextField label="Email" type="email" />
      <Button variant="accent" type="submit">
        Submit
      </Button>
    </Form>
  ),
};

export const ReadOnly: StoryObj<typeof Form> = {
  args: {
    isReadOnly: true,
  },
  render: (args) => (
    <Form {...args}>
      <TextField label="Name" value="John Doe" />
      <TextField label="Email" value="john@example.com" type="email" />
      <Button variant="accent" type="submit">
        Submit
      </Button>
    </Form>
  ),
};

export const Disabled: StoryObj<typeof Form> = {
  args: {
    isDisabled: true,
  },
  render: (args) => (
    <Form {...args}>
      <TextField label="Name" />
      <TextField label="Email" type="email" />
      <Button variant="accent" type="submit">
        Submit
      </Button>
    </Form>
  ),
};
