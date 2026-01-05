import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import React from 'react';

import { Button } from '../Buttons';

import { Form, TextField } from './index';

/**
 * https://react-spectrum.adobe.com/Form
 */
const meta: Meta<typeof Form> = {
  title: 'Components/Forms/Form',
  component: Form,
  tags: ['autodocs'],
  argTypes: {
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
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
    validationErrors: { name: 'Name is required', email: 'EMail is required' },
  },
  render: (args) => (
    <Form {...args}>
      <TextField name="name" label="Name" isRequired />
      <TextField name="email" label="Email" type="email" isRequired />
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
