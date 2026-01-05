import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { Heading } from '../Content';
import { Content } from '../Layout';

import { InlineAlert } from './index';

/**
 * Inline alerts display a non-modal message associated with objects in a view.
 * These are often used in form validation, providing a place to aggregate feedback related to multiple fields.
 *
 * https://react-spectrum.adobe.com/InlineAlert
 */
const meta: Meta<typeof InlineAlert> = {
  title: 'Components/Status/InlineAlert',
  component: InlineAlert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'positive', 'notice', 'negative'],
    },
    autoFocus: { control: 'boolean' },
  },
  args: {
    variant: 'neutral',
    autoFocus: false,
  },
};
export default meta;

export const Basic: StoryObj<typeof InlineAlert> = {
  render: (args) => (
    <InlineAlert {...args}>
      <Heading>Alert Title</Heading>
      <Content>This is an inline alert message with important information for the user.</Content>
    </InlineAlert>
  ),
};

export const Neutral: StoryObj<typeof InlineAlert> = {
  args: { variant: 'neutral' },
  render: (args) => (
    <InlineAlert {...args}>
      <Heading>Neutral</Heading>
      <Content>This is a neutral inline alert.</Content>
    </InlineAlert>
  ),
};

export const Informative: StoryObj<typeof InlineAlert> = {
  args: { variant: 'informative' },
  render: (args) => (
    <InlineAlert {...args}>
      <Heading>Information</Heading>
      <Content>This is an informative inline alert.</Content>
    </InlineAlert>
  ),
};

export const Positive: StoryObj<typeof InlineAlert> = {
  args: { variant: 'positive' },
  render: (args) => (
    <InlineAlert {...args}>
      <Heading>Success</Heading>
      <Content>Your changes have been saved successfully.</Content>
    </InlineAlert>
  ),
};

export const Notice: StoryObj<typeof InlineAlert> = {
  args: { variant: 'notice' },
  render: (args) => (
    <InlineAlert {...args}>
      <Heading>Warning</Heading>
      <Content>Please review your input before proceeding.</Content>
    </InlineAlert>
  ),
};

export const Negative: StoryObj<typeof InlineAlert> = {
  args: { variant: 'negative' },
  render: (args) => (
    <InlineAlert {...args}>
      <Heading>Error</Heading>
      <Content>An error occurred while processing your request.</Content>
    </InlineAlert>
  ),
};

export const AllVariants: StoryObj<typeof InlineAlert> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <InlineAlert variant="neutral">
        <Heading>Neutral</Heading>
        <Content>This is a neutral alert.</Content>
      </InlineAlert>
      <InlineAlert variant="informative">
        <Heading>Info</Heading>
        <Content>This is an info alert.</Content>
      </InlineAlert>
      <InlineAlert variant="positive">
        <Heading>Positive</Heading>
        <Content>This is a positive alert.</Content>
      </InlineAlert>
      <InlineAlert variant="notice">
        <Heading>Notice</Heading>
        <Content>This is a notice alert.</Content>
      </InlineAlert>
      <InlineAlert variant="negative">
        <Heading>Negative</Heading>
        <Content>This is a negative alert.</Content>
      </InlineAlert>
    </div>
  ),
};
