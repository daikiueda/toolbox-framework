import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { InlineError } from './index';

/**
 * InlineError is a specialized InlineAlert component for displaying error messages.
 * It wraps InlineAlert with variant="negative" and provides a default error title.
 */
const meta: Meta<typeof InlineError> = {
  title: 'Components/Status/InlineError',
  component: InlineError,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    children: 'An unexpected error occurred. Please try again later.',
  },
};
export default meta;

export const Basic: StoryObj<typeof InlineError> = {};

export const WithDefaultTitle: StoryObj<typeof InlineError> = {
  args: {
    children: 'Failed to load data from the server.',
  },
};

export const WithCustomTitle: StoryObj<typeof InlineError> = {
  args: {
    title: 'Connection Error',
    children: 'Unable to connect to the server. Please check your internet connection.',
  },
};

export const ValidationError: StoryObj<typeof InlineError> = {
  args: {
    title: 'Validation Failed',
    children: 'Please correct the following errors before submitting the form.',
  },
};

export const DetailedError: StoryObj<typeof InlineError> = {
  render: () => (
    <InlineError title="Upload Failed">
      <p>The file could not be uploaded due to the following reasons:</p>
      <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
        <li>File size exceeds the maximum limit of 10MB</li>
        <li>File type is not supported</li>
      </ul>
    </InlineError>
  ),
};
